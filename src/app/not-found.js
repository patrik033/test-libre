import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function NotFound() {
  
  redirect("/Error404")
//   return <div>
//       <h1>Not found – 404!</h1>
//       <div>
//         <Link href="/">Go back to Home</Link>
//       </div>
//   </div>
}