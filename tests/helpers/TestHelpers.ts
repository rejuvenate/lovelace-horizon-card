import { html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit-element";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TTemplateResultFunction = (...args: any[]) => TemplateResult

@customElement("test-element")
export class TemplateResultTestHelper<T extends TTemplateResultFunction, U extends Parameters<T> = Parameters<T>> extends LitElement {
  @state()
  templateResultFunctionData?: U;

  @state()
  templateResultFunction?: T;

  n = 5;

  constructor(templateResultFunction: T, templateResultFunctionData?: U) {
    super();

    this.templateResultFunction = templateResultFunction;
    this.templateResultFunctionData = templateResultFunctionData;
  }

  render(): TemplateResult {
    const data = this.templateResultFunctionData ?? [];
    return this.templateResultFunction?.(...data) ?? html`<span>No function assigned</span>`;
  }
}

export class CustomSnapshotSerializer {
  // eslint-disable-next-line no-use-before-define
  static instance?: CustomSnapshotSerializer;

  constructor() {
    if (CustomSnapshotSerializer.instance) {
      return CustomSnapshotSerializer.instance;
    }

    CustomSnapshotSerializer.instance = this;
  }

  test(snapshotContent: unknown): boolean {
    return typeof snapshotContent === "string";
  }

  print(snapshotContent: unknown): string {
    const idRegex = /\$[\d]+\$/mg;
    return (snapshotContent as string).replace(idRegex, "");
  }
}
