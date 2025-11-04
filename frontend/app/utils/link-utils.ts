//build links is used to prepend links with their corresponding environment. ie MSCA with their test vs prod environment
export function buildLink(linkType: string | undefined, link: string) {
  const { MSCA_BASE_URL, MSCA_EQ_BASE_URL, MSCA_ECAS_RASC_BASE_URL } = globalThis.__appEnvironment;

  //If no type assume full or relative link
  if (linkType === undefined) {
    return link;
  } else if (linkType === 'msca-base-url') {
    return MSCA_BASE_URL + link;
  } else if (linkType === 'msca-eq') {
    return MSCA_EQ_BASE_URL + link;
  } else if (linkType === 'ecas-rasc') {
    return MSCA_ECAS_RASC_BASE_URL + link;
  }
  //Fall back on link if unknown type
  else {
    return link;
  }
}
