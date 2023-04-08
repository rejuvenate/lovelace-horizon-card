import re


def scale(group, x_offset, x_length, y_offset, y_length):
    x = float(group[2])
    y = float(group[3])

    x *= x_length/400
    x += x_offset
    x = round(x, 3)

    y *= y_length/100
    y += y_offset
    y = round(y, 3)

    return f"{group[1]}{x},{y}"


# Base curve composed of two segments
# Full
# base_curve = "M0,100 C72.84,100 127.16,0 200,0 C272.84,0 327.16,100 400,100"
# Simplified
base_curve = "M0,100 C72.84,100 127.16,0 200,0 S327.16,100 400,100"

groups = re.findall(r"(([A-Z ]+)([0-9.]+)[, ]+([0-9.]+))", base_curve)
scaled = []
for g in groups:
    scaled.append(scale(g, 5, 540, 20, 126))

# Prints scaled curve
print("".join(scaled))
