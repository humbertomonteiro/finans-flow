import Header from "@/app/components/template/Header";
import Main from "@/app/components/template/Main";

export default function Layout(props: any) {
  return (
    <div>
      <Header />
      <Main>{props.children}</Main>
    </div>
  );
}
