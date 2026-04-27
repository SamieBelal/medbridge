export interface NPPESResult {
  npi: string;
  name: string;
  firstName: string;
  lastName: string;
  credential: string;
  taxonomy: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
}

export async function lookupNPI(npi: string): Promise<NPPESResult | null> {
  const url = `https://npiregistry.cms.hhs.gov/api/?number=${encodeURIComponent(npi)}&version=2.1`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;

  const result = data.results[0];
  const basic = result.basic || {};
  const taxonomy = result.taxonomies?.[0] || {};
  const address = result.addresses?.[0] || {};

  return {
    npi: result.number,
    name: `${basic.first_name || ""} ${basic.last_name || ""}`.trim(),
    firstName: basic.first_name || "",
    lastName: basic.last_name || "",
    credential: basic.credential || "",
    taxonomy: taxonomy.desc || "",
    address: {
      line1: address.address_1 || "",
      line2: address.address_2 || "",
      city: address.city || "",
      state: address.state || "",
      zip: address.postal_code?.slice(0, 5) || "",
    },
    phone: address.telephone_number || "",
  };
}
