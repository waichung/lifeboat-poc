import React from 'react';

type LoginAndSignUpButtonsProps = {
  contentType: number;
  onForward: React.MouseEventHandler<HTMLButtonElement>;
};

const LoginAndSignUpButtons = ({
  onForward,
  contentType,
}: LoginAndSignUpButtonsProps) => {
  const signInClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    onForward(e);
  };

  return (
    contentType === 0 && (
      <>
        <button
          onClick={signInClickHandler}
          className="ml-1 mt-5 flex w-4/5 flex-row items-center justify-center rounded-full border bg-white px-4 py-2 text-lg transition disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-700"
        >
          Log In
        </button>
      </>
    )
  );
};

export default LoginAndSignUpButtons;
