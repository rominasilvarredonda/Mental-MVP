import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenLayout } from "@/components/layout/ScreenLayout";

type LoginScreenProps = { email: string; password: string; error: string | null; isPending: boolean; onEmail: (value: string) => void; onPassword: (value: string) => void; onSubmit: () => void; onForgot: () => void; onClose: () => void; onRegister: () => void };
export function LoginScreen({ email, password, error, isPending, onEmail, onPassword, onSubmit, onForgot, onClose, onRegister }: LoginScreenProps) {
  return <ScreenLayout progress={0} onClose={onClose}><section className="flow-step login-step"><div className="overline">INGRESÁ A MENTAL</div><h1>Qué bueno verte de nuevo.</h1><p>Ingresá tus datos para volver a tu espacio personal.</p><form className="login-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><label>Email<Input required type="email" value={email} onChange={(event) => onEmail(event.target.value)} placeholder="nombre@email.com" /></label><label>Contraseña<Input required type="password" value={password} onChange={(event) => onPassword(event.target.value)} placeholder="••••••••" /></label><button type="button" className="forgot" onClick={onForgot}>¿Olvidé mi contraseña?</button><p className="flow-error" role="alert">{error}</p><Button disabled={isPending} type="submit">{isPending ? "Ingresando..." : "Ingresar →"}</Button></form><p className="login-new">¿Todavía no tenés cuenta? <button type="button" onClick={onRegister}>Crear cuenta</button></p></section></ScreenLayout>;
}
