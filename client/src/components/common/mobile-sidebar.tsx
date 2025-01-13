import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import Nav from "./nav";
import { CgMenu } from "react-icons/cg";
import { useState } from "react";

const MobileSidebar = () => {
  const [isMobileNav, setIsMobileNav] = useState(false);
  const onOpen = () => setIsMobileNav(!isMobileNav);
  const onClose = () => setIsMobileNav(false);
  const onOpenChange = () => setIsMobileNav(!isMobileNav);

  return (
    <Sheet open={isMobileNav} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" onClick={onOpen}>
          <CgMenu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle>OnlyFriends</SheetTitle>
        </SheetHeader>
        <Nav isMobileNav={isMobileNav} onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
