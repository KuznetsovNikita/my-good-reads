/**
 * Fetch call always resolves even with bad requests (except network error)
 * so adding a wrapper over fetch to reject request if response is not ok
 * Rejected promise can be caught with catch at the calling functions and can be handled
 * @param url
 * @param config
 */
const fetchUrl = <T>(url: string, config = {}): Promise<T> =>
  fetch(url, config).then(async (response) => {
    const data = await response.json();
    return response.ok ? data : Promise.reject(data);
  });
export default fetchUrl;
