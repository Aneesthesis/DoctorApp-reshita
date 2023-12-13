export function MessageBox(props) {
  return (
    <div className="error-message-box text-center mx-auto my-10">
      <p>{props.children}</p>
    </div>
  );
}
