type LocationLike = Pick<Location, 'href'>;

/** Browser navigation helper — optional location keeps production behavior identical. */
export function redirectTo(
  path: string,
  location: LocationLike = window.location,
) {
  location.href = path;
}
