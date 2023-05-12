async function getJoursFeries(year: number) {
  try {
    const resp = await fetch(
      `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`,
      { next: { revalidate: 60 * 60 * 24 } }
    );
    return resp.json();
  } catch (e) {
    throw e;
  }
}

export type JoursFeries = { [key: string]: string };

export async function getAllJoursFeries(
  monthStart: Date
): Promise<JoursFeries> {
  let currentYear = monthStart.getFullYear();
  try {
    const [prev, curr, next] = await Promise.all([
      getJoursFeries(currentYear - 1),
      getJoursFeries(currentYear),
      getJoursFeries(currentYear + 1),
    ]);

    return { ...prev, ...curr, ...next };
  } catch (e) {
    console.error(e);
    console.error("Could not load jours-feries");
    return {};
  }
}
