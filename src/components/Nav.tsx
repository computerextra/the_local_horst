"use client";

import Link from "next/link";
import * as React from "react";

import ModeToggle from "@/components/ModeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Nav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Frühstück
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/Geburtstage" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Geburtstage
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/Geburtstage" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              CE Archiv
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/Geburtstage" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Zeiterfassung
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Telefonlisten</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[900px] ">
              <ListItem href="/Telefonlisten/Mitarbeiter" title="Mitarbeiter">
                Auflistung aller Mitarbeiter
              </ListItem>
              <ListItem href="/Telefonlisten/Lieferanten" title="Lieferanten">
                Sammlung von Lieferanten mit APs
              </ListItem>
              <ListItem href="/Telefonlisten/Sage" title="Sage Suche">
                Suche direkt im Sage nach Lieferanten / Kunden
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Service</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[900px] ">
              <ListItem href="/Telefonlisten/Mitarbeiter" title="Inventur">
                Auflistung der Inventurdaten
              </ListItem>
              <ListItem href="/Telefonlisten/Lieferanten" title="Seriennummern">
                Maske für schnellere SN Eingabe im Intrexx
              </ListItem>
              <ListItem href="/Telefonlisten/Sage" title="Info an Kunden">
                Info Mail an KD zum Abholen von ET
              </ListItem>
              <ListItem href="/Telefonlisten/Sage" title="Datenschutzportal">
                Datenschutzportal von Computer Extra & AEM
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>CMS</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[900px] ">
              <ListItem href="/Telefonlisten/Mitarbeiter" title="Abteilung">
                Verwaltung der Angezeigten Abteilungen auf der CE Website
              </ListItem>
              <ListItem href="/Telefonlisten/Lieferanten" title="Mitarbeiter">
                Verwaltung der Angezeigten Mitarbeiter auf der CE Website
              </ListItem>
              <ListItem href="/Telefonlisten/Sage" title="Partner">
                Verwaltung der Angezeigten Partner auf der CE Website
              </ListItem>
              <ListItem href="/Telefonlisten/Sage" title="Angebote">
                Verwaltung der Angezeigten Angebote auf der CE Website
              </ListItem>
              <ListItem href="/Telefonlisten/Sage" title="Jobs">
                Verwaltung der Angezeigten Jobs auf der CE Website
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>{" "}
        <NavigationMenuItem>
          <Link href="/Geburtstage" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Werkstatt
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div className="ms-2">
        <ModeToggle />
      </div>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
