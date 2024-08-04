"use client";

import axios from "axios";
import { signIn } from "next-auth/react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState, useCallback } from "react";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import toast from "react-hot-toast";

import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import { useRouter } from "next/navigation";

// // chú ý doạn này thay bang FieldValue
// interface IFormInput {
//   name: string;
//   email: string;
//   password: string;
// }
const LoginModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.ok) {
        toast.success("logged in");
        router.refresh();
        loginModal.onClose();
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {}}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => {}}
      />
      <div className=" text-neutral-500 text-center mt-4 font-light ">
        <div className="flex flex-row items-center gap-2 justify-center">
          <div>Already have account ?</div>
          <div
            onClick={registerModal.onClose}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      title="Login"
      disabled={isLoading}
      actionLabel="Continue"
      isOpen={loginModal.isOpen}
      onSubmit={handleSubmit(onSubmit)}
      onClose={loginModal.onClose}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
