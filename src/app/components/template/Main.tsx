import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
}
export default function Main({ children }: MainProps) {
  return <main className="container md:my-12 mt-12 mb-24">{children}</main>;
}
