import { validateRequest } from "@/lib/auth"
import Landing from "./components/Landing"
import { redirect } from 'next/navigation'

export default async function Home() {
  // const router = useRouter()
  const {user} = await  validateRequest()
  if(!user){
    return <Landing/>
  }
  else{
    redirect('/home');
  }
}