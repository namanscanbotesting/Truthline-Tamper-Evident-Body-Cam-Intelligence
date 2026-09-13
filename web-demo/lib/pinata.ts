const PINATA_ENDPOINT = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export async function pinFileToIPFS(file: File): Promise<string> {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error("Missing PINATA_JWT");
  }

  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await fetch(PINATA_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pinata upload failed: ${response.status} ${body}`);
  }

  const json = (await response.json()) as { IpfsHash?: string };
  if (!json.IpfsHash) {
    throw new Error("Pinata response missing IpfsHash");
  }

  return json.IpfsHash;
}

