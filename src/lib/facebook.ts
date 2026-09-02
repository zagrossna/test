type FacebookProduct = {
  name: string;
  description: string;
  image: string;
  priceTomanDisplay: string;
};

function getConfig() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageId || !accessToken) {
    throw new Error(
      "FACEBOOK_PAGE_ID یا FACEBOOK_PAGE_ACCESS_TOKEN تنظیم نشده است."
    );
  }
  return { pageId, accessToken };
}

export async function postProductToFacebook(product: FacebookProduct) {
  const { pageId, accessToken } = getConfig();
  const caption = `${product.name}\n${product.description}\nقیمت: ${product.priceTomanDisplay}`;
  const isPublicImage = /^https?:\/\//.test(product.image);

  const endpoint = isPublicImage
    ? `https://graph.facebook.com/v21.0/${pageId}/photos`
    : `https://graph.facebook.com/v21.0/${pageId}/feed`;

  const params = new URLSearchParams({ access_token: accessToken });
  if (isPublicImage) {
    params.set("url", product.image);
    params.set("caption", caption);
  } else {
    params.set("message", caption);
  }

  const res = await fetch(endpoint, { method: "POST", body: params });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "خطا در ارسال پست به فیسبوک.");
  }

  return data;
}
