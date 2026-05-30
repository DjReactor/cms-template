export function Header(props: any) {
  return (
    <div className="p-4 border m-4 bg-white text-black">
      <h2>Header Placeholder</h2>
      <p>Light Mode - Home Services</p>
      {props.children}
    </div>
  );
}