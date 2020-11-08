### 🥣 Svelte Sapper Soup! - UX-story 🥣

## _Unfiltered director's cut_

[Back to main readme](../README.md)

### PROLOGUE

_My favorite restaurant was finally releasing that online menu along with their home delivery service and they needed me bad, so bad. Now - even if was the only talented developer left in Stockholm (as far as knew, I uninstalled LinkedIn for a while) they wanted to ensure I was the one for the job so I sad:_

-- HEY! Let's skip the crap and flush the hype.
-- Sir, if we could just..
-- Let's build a prototype.

_They were immediately sold by my passionate vibe. Now, I could just dive right in. Create some skeleton views and google ”best auth-management”. But that would make this an ordinary Tuesday (3-4 AM) for the rest of the month. Let's do a UX-study before implementation._

#

#

### CASE

#### Typeof request

- A health- and environment-oriented restaurant with a good reputation wants to reach more potential customers in the city.
- They they need an online platform to connect their services and reach their goals, both customer- and admin-UI:s.

#### Args

- Deliver food that aligns with and contributes to a healthy lifestyle
- Generate returning customers
- Also enhance attention to their physical resturant

#### Enduser

- City residents for whom spontaneous dinners without effort is a natural part of life - to buy for themselves or a friend.

#### Not in scope

- They manage food
- They manage logistics
- They manage PR and marketing

#

#

### THE WHOLE PROJECT IN 3 STEPS

1. UX-study
2. Mockup & testing
3. Implementation
4. Possible ['trichotillomania'](https://en.wikipedia.org/wiki/Trichotillomania)

3 steps and 1 fear. Perfect.

### 1. UX-STUDY

##### - Kickoff

Gather a couple of UX-friends (any type of good friend will do) and discuss the case. You’re done when everybody understands every aspect of the requirement specification, or when you’re out of coffe.
_check._

#

##### - Target

Write down all possible target groups. Pick one to focus on.
_Middle- to upperclass citienz in Stockholm
who appreciates the comfort in ordering meals online,
or who would enjoy giving a meal away as a gift._

#

##### - User context

Why, how, when and in what situation/mode will the users use … this?
_Mobile browser first (yeah, you still say that out loud ... if the year is 2011).
Perhaps after work/in the evening. Weekends?
Probably when they’re stressed, tired and already hungry.
Because they just didn’t plan to … get hungry. Ever._

#

##### - Value Proposition Canvas (in Swedish)

By interviewing potential customers
and reading reviews of similar services,
we can uncover user needs and potential gains/pains.
How will the company handle these aspects?

#

#

| Behov + Mål (Customer Jobs)                                                  | Service + Tjänster (Products & Services)                                 |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Välja en eller flera soppor ur ett utbud                                     | Möjlighet att välja mellan ca 8 oli soppor                               |
| Se beskrivningar av produkternas innehåll                                    | "Bild, pris, ingredienser, allergiinfo                                   | Beskrivande text kring respektive soppa - ingredienser" |
| Jag vill kunna ange adress, leveranstid/datum och betala på ett smidigt sätt | Fält och funktionalitet för leveransadress,                              | leveransdatum/tid och betalning |
| Kunna betala med kort                                                        | Betalningsfunktionalitet                                                 |
| Följa min order-status Visa orderstatus                                      | Skriva personlig hälsning Fält för personligt meddelande till mottagaren |

| Värden (Gains)                                     | Värdeskapare (Gain creators)                                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Få ett hälsosamt intryck av köpet                  | Trycka på de hälsosamma fördelarna kring innehållet                                                   |
| Vill vara säker på att jag får det jag beställer   | Tydlig bekräftelse/översikt av beställning. Möjlighet för mottagaren att bekräfta att ordern stämmer? |
| Kunna betala med swish/kort/klarna                 | Betalningsmöjligheter: swish, kreditkort, klarna                                                      |
| Filtrera produkter                                 | Visa utbud utifrån profil-val (veg, allergi etc…)                                                     |
| Kunna skräddarsy beställningen                     | Välj storlek/personer/portioner och tillbehör                                                         |
| Kunna lägga in i kylen direkt/spara till annan dag | Valmöjlighet, varm/kall                                                                               |
| Kunna ta del av special-erbjudanden/rewards        | Visa specialerbjudanden/rewards (styrs på admin-sidan?)                                               |
| Utöver ingredienser, även kalorier                 | Översikt av ingredienser, råvaro-info, kalori-info, ev kuriosa                                        |
| Kunna se tidigare val/favoriter                    | Spara tidigare val/favoriter (gäst: local storage, konto: db)                                         |
| Vegetariska alternativ                             | Vegetariskt som filter-alternativ                                                                     |
| Få personliga tips utifrån tidigare val            | Generera produkttips utifrån tidigare val/hälsoaspekter/profil                                        |
| Kunna prenumerera                                  | Formulär för prenumeration                                                                            |
| Välja annat leveransdatum                          | Fält för leveransdatum                                                                                |
| Snygga/personliga paketeringar för gåvor           | Valmöjlighet av ett antal tilltalande paketerings-möjligheter                                         |

| Smärtor (Pains)                                          | Smärtstillare (Pain relievers)                           |
| -------------------------------------------------------- | -------------------------------------------------------- |
| Betalningsprocessen strular/tar för lång tid             | ...                                                      |
| Inte få vad man beställt                                 | ...                                                      |
| Otydlig/inkonsekvent navigering, lätt att tappa bort sig | Tydliga steg från val av produkter till lagd beställning |
| För få betalningsalternativ                              | Swish/kort/klarna                                        |
| Dålig feedback-möjlighet, särskilt med gåvoperspektiv    | Standardisera feedback för mottagaren                    |
| På tok för dyrt!                                         | ...                                                      |

#### - Basic flow-chart before first mockup

| TITEL                                              | Landing-page                                                           | Välja en soppa                           | Innehåll/detaljer                         | Skräddarsy                                            | Varukorgen                                                               | Fyll i adress                                        | Ange betalningsuppgifter- slutför | Beställning lagd                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------ |
| **MÅL**                                            | Förstå var jag hamnat och snabbt kunna komma igång med min beställning | "Lätt att välja utifrån utbudet"         | tydliga beskrivningar                     | Kunna skräddarsy beställningen                        | Få en bra översikt över beställningen. Lätt att justera eller gå vidare. | Fylla i sin/mottagarens adress                       | Hitta lämplig betalningsmetod     | Få en tydlig bekräftelse, översikt av beställning samt orderstatus |
| **FUNKTIONALITET**                                 | Välkommen/logga/presentation                                           | Välja storlek (tex antal portioner)      | Tydliga beskrivningar av soppans innehåll | Tydliga steg för att lägga till och ta bort tillbehör | Visa Totalpris, kvantitet, tillbehör etc                                 | Inputfält för adress                                 | Möjlighet att betala med kort     | Tydlig bekräftelse                                                 |
|                                                    |                                                                        | Filtrera utbudet                         | Betona hälsosamma aspekter i produkterna  | Bekräftelse på tillagd produkt/Prisuppdatering        | Tydlig "slutför beställning"-knapp?                                      | Välj om du vill skicka som gåva eller till dig själv | Möjlighet att betala med swish    | Översikt av beställning, adress etc                                |
|                                                    |                                                                        | Kunna se tidigare val/favoriter          | Utöver ingredienser, även kalorier        | Kunna ta del av special-erbjudanden/rewards           |                                                                          | Skriva personlig hälsning                            | Möjlighet att betala med Klarna   | Utsökt uppdatering av leveransstatus                               |
|                                                    |                                                                        | Få personliga tips utifrån tidigare val  |                                           | Välja varm/kall                                       |                                                                          | Välja annat leveransdatum                            |                                   | Följa budet på karta (live sync)                                   |
|                                                    |                                                                        |                                          |                                           |                                                       |                                                                          | Medlem/gäst?                                         |                                   | Bekräftelse skickas per epost/tel                                  |
| **Hälsosamt intryck**                              |                                                                        | Betona hälsosamma fördelar med produkten | Betona hälsosamma fördelar med produkten  |
| **Uppleva en snabb/tydlig navigering och process** | Tydlig väg/länk direkt till sopporna                                   |                                          |                                           | Tydliga delsteg                                       |                                                                          |                                                      | Tydliga delsteg                   |
| **_Övergripande_**                                 | _Tydlighet, Vill vara säker på att jag får det jag beställer_          | _Smidig navigering_                      |
| **Övriga tankar**                                  | Presentkort ?                                                          |

#

#

#### 2. MOCKUP & TESTING

#### - Mockup user test feedback summary (Swedish)

##### _User task: visit the site, order a salmon-soup and receive a confirmation of the purchase and that the soup is on its way._

#

| **Hur upplever du flödet och navigeringen?**               | **Är rewardgrejen ("klipp-kupongen") ett erbjudande som ökar chanserna för att du ska använda appen igen? Tankar kring det?** | **Något du tänker på som rör flödet (ta sig från A till B)?**                                                                                               | **Något du tänker på som rör designen, utseendet eller placeringar av element?**                                                                                                                                                        | **Övriga tankar?**                                                                                      |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Flödet ser bra ut. Det är enkelt att ta sig runt på sidan. | Nej, beställer för sällan för att det ska kännas lönsamt, vet ej nästa gång det blir. Ja, absolut.                            | Saknar filtrering. Kunna swipea sig ur infosidan snabbt. Många steg, men tydligt. Tydligare bekräftelse av att något läggs till i varukorgen! Allt är gött! | Peach-färgen passar inte / suger / sitter inte ihop med annat. Gillar inte typsnittet. Större dopamin-främjande dramatik i orderbekräftelsen (peppiga animationer). Gillar designen, stora tydliga matbilder. Gillar intro-animationen. | Tydligare progressbar. Bra betalningsalternativ. Leveransavgiften kommer som en överraskning på slutet. |

#### _[The clickable Figma-prototype](https://www.figma.com/proto/ijGuWgLJCxmOTXo9GPjyeo/Online-Soup?node-id=0%3A1&scaling=scale-down)_

#

#

#### 3. IMPLEMENTATION

1. I started.
2. I followed the guidlines created in previous UX-steps.
3. I let some less necessary or too hard functionalities go.
4. Then I stopped.

Coming from React in previous projects I had never touched Svelte before. My impression was "modern" and "different from React". So I thought, new is always ... new! The build process was overall pretty intense. Svelte, on one hand, was very easy to dive into and make cool stuff with. But since I was unprepared having to think about bundling, the code build-process and if something renders in the browser or not, Sapper gave me a couple of long nights. A potential novice-pitfall when it comes to Svelte (and Javascript in general) as that you almost from the start can impress yourself with drastic results. And if you ride on that wave too long without thinking you could end up with a lot of code that worked well when the app was still small. Anyway! I had so much fun doing this project for a month. There were endeed moments of [pulling my hair in despair](https://en.wikipedia.org/wiki/Trichotillomania) but overall just days of total inspiration.

### This was the brief story of Svelte Sapper Soup.

##### Thank you. Thank you all.

#

##### [kiiim.se](https://kiiim.se)

##### [butalsoverycool](https://github.com/butalsoverycool)

#

#

#

[Main readme](../README.md)
