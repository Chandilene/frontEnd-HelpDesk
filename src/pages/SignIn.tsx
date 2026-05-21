import { useActionState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";

import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { LinkButton } from "../components/LinkButton";

const signInSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().trim().min(1, { message: "Informe a senha" }),
});

export function SignIn() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  const auth = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function signIn(_: any, formData: FormData) {
    try {
      const data = signInSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      const response = await api.post("/sessions", data);

      auth.save(response.data);
    } catch (error) {
      console.error("Erro na action:", error);
      if (error instanceof ZodError) {
        return { message: error.issues[0].message };
      }

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message };
      }

      return { message: "Não foi possivel fazer login" };
    }
  }
  return (
    <div>
      <div className="w-full align-center border border-gray-500 rounded-lg mt-4 p-5 ">
        <h2 className="text-xl font-bold text-gray-200 ">Acesse o portal</h2>
        <p className="text-xs text-gray-300 mb-4">
          Entre usando seu e-mail e senha cadastrados
        </p>

        <form action={formAction} className="w-full flex flex-col gap-4">
          <Input
            required
            name="email"
            legend="E_MAIL"
            type="email"
            placeholder="exemplo@mail.com"
          />

          <Input
            required
            name="password"
            legend="SENHA"
            type="password"
            placeholder="Digite sua senha"
          />

          <p className="text-sm text-red-600 text-center font-medium">
            {state?.message}
          </p>

          <Button type="submit" isLoading={isPending}>
            Entrar
          </Button>
        </form>
      </div>
      <div className="max-w- align-center border border-gray-500 rounded-lg mt-6 mb-4 p-6 ">
        <h2 className="text-lg font-bold text-gray-200 ">
          Ainda não tem conta?
        </h2>
        <p className="text-xs text-gray-300 mb-8">Cadastre agora mesmo</p>
        <LinkButton href="/signup">Criar conta</LinkButton>
      </div>
    </div>
  );
}
