import fetchUrl from "./../shared/fetchUrl/fetchUrl";

interface Response<A> {
  items: A[];
}

export async function getBooksByType<A>(type: string): Promise<Response<A>> {
  try {
    return await fetchUrl(
      `https://www.googleapis.com/books/v1/volumes?q=${type}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (exception) {
    return { items: [] };
  }
}
