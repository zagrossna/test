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

function getInstagramConfig() {
  const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!igUserId || !accessToken) {
    throw new Error(
      "INSTAGRAM_BUSINESS_ACCOUNT_ID یا FACEBOOK_PAGE_ACCESS_TOKEN تنظیم نشده است."
    );
  }
  return { igUserId, accessToken };
}

export async function postProductToInstagram(product: FacebookProduct) {
  if (!/^https?:\/\//.test(product.image)) {
    throw new Error("عکس محصول باید یک لینک عمومی معتبر باشد تا در اینستاگرام پست شود.");
  }

  const { igUserId, accessToken } = getInstagramConfig();
  const caption = `${product.name}\n${product.description}\nقیمت: ${product.priceTomanDisplay}`;

  const createRes = await fetch(
    `https://graph.facebook.com/v21.0/${igUserId}/media`,
    {
      method: "POST",
      body: new URLSearchParams({
        image_url: product.image,
        caption,
        access_token: accessToken,
      }),
    }
  );
  const createData = await createRes.json();
  if (!createRes.ok) {
    throw new Error(createData?.error?.message || "خطا در ساخت پست اینستاگرام.");
  }

  const publishRes = await fetch(
    `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
    {
      method: "POST",
      body: new URLSearchParams({
        creation_id: createData.id,
        access_token: accessToken,
      }),
    }
  );
  const publishData = await publishRes.json();
  if (!publishRes.ok) {
    throw new Error(publishData?.error?.message || "خطا در انتشار پست اینستاگرام.");
  }

  return publishData;
}
