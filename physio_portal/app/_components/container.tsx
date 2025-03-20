type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="w-full h-full overflow-hidden">{children}</div>;
};

export default Container;
