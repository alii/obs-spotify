import { PropsWithChildren } from "react";

export function Centered({ children }: PropsWithChildren) {
	return <div className="h-[200px] w-[800px] flex justify-center items-center">{children}</div>;
}
