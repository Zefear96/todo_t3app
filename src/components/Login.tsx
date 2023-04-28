import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "@mantine/core";
import { type NextPage } from "next";

const Login = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className=" mx-0 flex items-center justify-center">
      <div>
        <Avatar
          src={session?.user?.image}
          size="md"
          radius="xl"
          className=" mx-auto"
        />
        <p>{session?.user.name}</p>
      </div>
      <button
        onClick={session ? () => void signOut() : () => void signIn()}
        className=" mx-2 my-2 h-10  w-20 rounded-lg bg-blue-400 text-white"
      >
        {session ? "Logout" : "Login"}
      </button>
    </div>
  );
};

export default Login;
