import React from 'react'
import Homee from './Home/page'
import { authorization } from './hoc/auth';
async function page() {
  await authorization();
  return (
    <div>
      <Homee/>
    </div>
  )
}
export default page;