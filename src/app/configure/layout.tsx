import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Steps from "@/components/Steps";
import { ReactNode } from "react";

const layout =({children}:{children: ReactNode}) =>{
  return (
    <MaxWidthWrapper className="flex-1 flex-col flex">
      <Steps />
      {children}
    </MaxWidthWrapper>
  )

}

export default layout