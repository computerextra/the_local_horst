import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/utils/api";
import type { Einkauf, Mitarbeiter } from "@prisma/client";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

type EinkaufRes = Einkauf & {
  Mitarbeiter: Mitarbeiter;
};

export default function Home() {
  const EinkaufRes = api.einkauf.get.useQuery({ mitarbeiterId: undefined });
  const MitarbeiterRes = api.mitarbeiter.get.useQuery({ id: undefined });
  const router = useRouter();
  const [Einkauf, setEinkauf] = useState<EinkaufRes[] | null>();
  const [showAbrechnung, setShowAbrechnung] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Mitarbeiter | undefined>(
    undefined,
  );

  useEffect(() => {
    if (EinkaufRes.data == null) return;

    const Einkauf = EinkaufRes.data as EinkaufRes[];
    const WirklicheDaten: EinkaufRes[] = [];

    Einkauf.forEach((x) => {
      if (
        x.Abgeschickt != null &&
        x.Mitarbeiter.Name != null &&
        x.Dinge != null &&
        (new Date(x.Abgeschickt).toDateString() == new Date().toDateString() ||
          (x.Abonniert && new Date(x.Abgeschickt) <= new Date()))
      ) {
        WirklicheDaten.push(x);
      }
    });

    setEinkauf(WirklicheDaten);
  }, [EinkaufRes.data]);

  if (EinkaufRes.isLoading) return <p>Loading</p>;
  if (MitarbeiterRes.isLoading) return <p>Loading</p>;
  if (EinkaufRes.isError) return <p>Fehler</p>;
  if (MitarbeiterRes.isError) return <p>Fehler</p>;

  const Mitarbeiter = MitarbeiterRes.data as Mitarbeiter[];

  const print = () => {
    const Window = window.open("", "PRINT", "height=1000,width=1200");
    if (Window == null) return;
    let body = "";
    body +=
      '<html><head><script src="https://cdn.tailwindcss.com"></script></head><body>';
    body += "<h1 class='text-center'>Einkaufsliste</h1>";
    body += "<h2 class='text-2xl text-center'>POST MITNEHMEN!</h2>";
    body +=
      '<div class="mx-auto mt-4 max-w-[80%]"><div class="relative w-full overflow-auto"><table class="w-full caption-bottom text-sm">';
    body +=
      '<thead class="[&amp;_tr]:border-b"><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">';
    body +=
      '<th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">Wer</th>';
    body +=
      '<th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">Geld</th>';
    body +=
      '<th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">Pfand</th>';
    body +=
      '<th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">Abo</th>';
    body +=
      '<th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">Was</th>';
    body +=
      '<th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">Bilder</th>';
    body += "</tr>";
    body += "</thead>";
    body += '<tbody class="[&amp;_tr:last-child]:border-0">';
    Einkauf?.forEach((x) => {
      body +=
        '<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">';
      body += `<td class="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] font-medium">${x.Mitarbeiter.Name}</td>`;
      body += `<td class="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">${x.Paypal ? "<span class='text-red-500'>Paypal</span>" : x.Geld != null ? x.Geld : ""}</td>`;
      body += `<td class="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">${x.Pfand != null ? x.Pfand : ""}</td>`;
      body += `<td class="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">${x.Abonniert ? "✔️" : "❌"}</td>`;
      body +=
        '<td class="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]"><ul style="list-style-type: none; padding: 0px;">';
      x.Dinge?.split("\n").map((y) => {
        body += `<li>${y}</li>`;
      });
      body +=
        '</ul></td><td class="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]"><div class="grid grid-cols-1">';
      if (
        x.Bild1 &&
        x.Bild1Date &&
        new Date(x.Bild1Date).toDateString() == new Date().toDateString() &&
        x.Bild1.length > 0
      ) {
        body += `<img alt='Einkauf Bild1 von ${x.Mitarbeiter.Name}' width="150" height="150" style="color: transparent; max-height: 200px; width: auto;" src='${x.Bild1}' />`;
      }

      if (
        x.Bild2 &&
        x.Bild2Date &&
        new Date(x.Bild2Date).toDateString() == new Date().toDateString() &&
        x.Bild2.length > 0
      ) {
        body += `<img alt='Einkauf Bild2 von ${x.Mitarbeiter.Name}' width="150" height="150" style="color: transparent; max-height: 200px; width: auto;" src='${x.Bild2}' />`;
      }
      if (
        x.Bild3 &&
        x.Bild3Date &&
        new Date(x.Bild3Date).toDateString() == new Date().toDateString() &&
        x.Bild3.length > 0
      ) {
        body += `<img alt='Einkauf Bild3 von ${x.Mitarbeiter.Name}' width="150" height="150" style="color: transparent; max-height: 200px; width: auto;" src='${x.Bild3}' />`;
      }
      body += "</div></td></tr>";
    });
    body += "</tbody>";
    body += "</table>";
    body += "</div></div>";
    body += "</body></html>";
    Window.document.write(body);
    Window.document.close();
    setTimeout(function () {
      Window.print();
    }, 500);
    Window.onfocus = function () {
      setTimeout(function () {
        Window.close();
      }, 500);
    };
  };

  const handleClick = async () => {
    if (selectedUser == null) return;

    await router.push("/Einkauf/" + selectedUser.id);
  };

  return (
    <>
      <Head>
        <title>Local Horst v10</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mx-auto mt-4 max-w-[80%]">
          <Popover>
            <PopoverTrigger asChild>
              <Button>Eingabe</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Select
                onValueChange={(e) =>
                  setSelectedUser(Mitarbeiter.find((x) => x.id == e))
                }
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Mitarbeiter auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {Mitarbeiter.map((x) => (
                    <SelectItem key={x.id} value={x.id}>
                      {x.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="mt-3" onClick={handleClick}>
                Eingeben
              </Button>
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={print} className="ms-2">
            Drucken
          </Button>
          <Button
            className="ms-2"
            onClick={() => setShowAbrechnung((prev) => !prev)}
          >
            Paypal Abrechnung
          </Button>
          {showAbrechnung && <PaypalAbrechnung Mitarbeiter={Einkauf} />}
          <Table>
            <TableCaption>Aktuelle Einkaufsliste</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Wer</TableHead>
                <TableHead>Geld</TableHead>
                <TableHead>Pfand</TableHead>
                <TableHead>Abo</TableHead>
                <TableHead>Was</TableHead>
                <TableHead>Bilder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Einkauf?.map((x) => (
                <TableRow key={x.id}>
                  <TableCell className="font-medium">
                    {x.Mitarbeiter.Name}
                  </TableCell>
                  <TableCell>
                    {x.Paypal ? (
                      <span className="text-red-600">Paypal</span>
                    ) : (
                      x.Geld
                    )}
                  </TableCell>
                  <TableCell>{x.Pfand}</TableCell>
                  <TableCell>{x.Abonniert ? "✔️" : "❌"}</TableCell>
                  <TableCell>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {x.Dinge?.split("\n").map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <div className="grid grid-cols-3">
                      {x.Bild1 &&
                        x.Bild1Date &&
                        new Date(x.Bild1Date).toDateString() ==
                          new Date().toDateString() &&
                        x.Bild1.length > 0 && (
                          <Image
                            src={x.Bild1}
                            alt={"Einkauf Bild 1 von " + x.Mitarbeiter.Name}
                            height={150}
                            width={150}
                            style={{ maxHeight: 200, width: "auto" }}
                          />
                        )}
                      {x.Bild2 &&
                        x.Bild2Date &&
                        new Date(x.Bild2Date).toDateString() ==
                          new Date().toDateString() &&
                        x.Bild2.length > 0 && (
                          <Image
                            src={x.Bild2}
                            alt={"Einkauf Bild 2 von " + x.Mitarbeiter.Name}
                            height={150}
                            width={150}
                            style={{ maxHeight: 200, width: "auto" }}
                          />
                        )}
                      {x.Bild3 &&
                        x.Bild3Date &&
                        new Date(x.Bild3Date).toDateString() ==
                          new Date().toDateString() &&
                        x.Bild3.length > 0 && (
                          <Image
                            src={x.Bild3}
                            alt={"Einkauf Bild 3 von " + x.Mitarbeiter.Name}
                            height={150}
                            width={150}
                            style={{ maxHeight: 200, width: "auto" }}
                          />
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}

const formSchema = z.object({
  username: z.string(),
  schuldner: z.string(),
  geld: z.string(),
});

function PaypalAbrechnung({
  Mitarbeiter,
}: {
  Mitarbeiter: EinkaufRes[] | null | undefined;
}) {
  // TODO: Abrechnungs Formular noch mal neu machen :(
  return <></>;
}
