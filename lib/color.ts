export function getColor(value: number, max: number = 15): string {
  const min = 0;
  const startColor = "#FF0000";
  const endColor = "#00FF00";

  // Calculate the percentage of the value within the range
  const _percentage = (value - min) / (max - min);
  const percentage = value > max ? 1 : value < min ? 0 : _percentage;

  // Interpolate the color based on the percentage
  const red = Math.round(
    (1 - percentage) * parseInt(startColor.slice(1, 3), 16) +
      percentage * parseInt(endColor.slice(1, 3), 16)
  );
  const green = Math.round(
    (1 - percentage) * parseInt(startColor.slice(3, 5), 16) +
      percentage * parseInt(endColor.slice(3, 5), 16)
  );
  const blue = Math.round(
    (1 - percentage) * parseInt(startColor.slice(5, 7), 16) +
      percentage * parseInt(endColor.slice(5, 7), 16)
  );

  // Convert the RGB values to a hexadecimal color code
  const color = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}77`;

  return color;
}
