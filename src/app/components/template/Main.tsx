import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
}
export default function Main({ children }: MainProps) {
  return <main className="container mb-24 mt-6 md:my-12">{children}</main>;
}
