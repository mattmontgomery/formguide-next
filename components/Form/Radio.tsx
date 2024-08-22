import { HTMLProps, PropsWithChildren } from "react";

export default function Radio(props: PropsWithChildren<{}>) {
  return <>{props.children}</>;
}

export function RadioInput(
  props: PropsWithChildren<
    {
      name: string;
      value: string | number;
      label: string;
    } & HTMLProps<HTMLInputElement>
  >
) {
  return (
    <label className="flex items-center gap-x-1">
      <input
        {...props}
        id={`${props.name}-${props.value}`}
        name={props.name}
        type="radio"
        className="w-4 h-4 cursor-pointer bg-red-500 selected:bg-red-700"
      />
      {props.label}
    </label>
  );
}
