import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function CompleteLayout ({ children }: PropsWithChildren) {
    return (
        <div className='px-5 flex flex-col bg-gray-200 overscroll-y-auto'>
            <Header />
            <div className='flex-1'>{children}</div>
            <Footer />
        </div>
    )
}