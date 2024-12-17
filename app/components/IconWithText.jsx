export default function IconWithText({text, children}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center text-lg text-primary font-light gap-5`}
    >
      <i className="scale-110 lg:scale-150">{children}</i>
      <span className="font-medium tracking-wide text-lg">{text}</span>
    </div>
  );
}
