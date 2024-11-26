import { useEffect, useState } from "react";
import {
  reactExtension,
  Text,
  useShippingOptionTarget,
  Image,
  InlineLayout,
  InlineSpacer,
  BlockLayout,
  useApi,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension(
  "purchase.checkout.shipping-option-item.render-after",
  () => <Extension />,
);

type ShippingLineMetaobjectNode = {
  fields: {
    key: string;
    value: string;
    type: string;
  }[];
  handle: string;
  id: string;
};

type DataType = {
  label?: string;
  image?: string;
  message?: string;
};

type MetaobjectResponse = {
  data?: {
    metaobjects?: {
      nodes: ShippingLineMetaobjectNode[];
    };
  };
  errors?: any[];
}

function Extension() {
  const { shippingOptionTarget } = useShippingOptionTarget();
  const { title: rawTitle } = shippingOptionTarget;
  const title = rawTitle.replace(/®/g, "");
  const { query } = useApi();
  const [shippingLines, setShippingLines] = useState<
    ShippingLineMetaobjectNode[]
  >([]);
  const [renderData, setRenderData] = useState<DataType | null>(null);

  const imageMap = {
    snail: {
      image:
        "https://cdn.shopify.com/s/files/1/0063/9900/0643/files/FM_-_Shipping_Icons_-_Single_Color_-_100_x_100_-_resized-05.png?v=1731533548",
      label: "EcoSaver",
    },
    turtle: {
      image:
        "https://cdn.shopify.com/s/files/1/0063/9900/0643/files/FM_-_Shipping_Icons_-_Single_Color_-_100_x_100_-_resized-06.png?v=1731533548",
      label: "EcoSpeed",
    },
    rabbit: {
      image:
        "https://cdn.shopify.com/s/files/1/0063/9900/0643/files/FM_-_Shipping_Icons_-_Single_Color_-_100_x_100_-_resized-07.png?v=1731533548",
      label: "Expedited Shipping",
    },
    bird: {
      image:
        "https://cdn.shopify.com/s/files/1/0063/9900/0643/files/FM_-_Shipping_Icons_-_Single_Color_-_100_x_100_-_resized-08.png?v=1731533548",
      label: "Express Shipping",
    },
  };

  useEffect(() => {
    if (renderData) return;

    query(
      `query ($first: Int!, $type: String!){
        metaobjects(type: $type, first: $first) {
          nodes {
            id
            handle
            fields {
              key
              value
              type
            }
          }
        }
      }`,
      {
        variables: { first: 20, type: "checkout_extension_shipping_lines" },
      },
    )
      .then(({ data, errors }: MetaobjectResponse) => {
        if (data?.metaobjects?.nodes) {
          setShippingLines(data.metaobjects.nodes);
        }
      })
      .catch(console.error);
  }, [query]);

  useEffect(() => {
    for (const metaobject of shippingLines) {
      let handle: string, icon: string, icon_label: string, message: string;
      for (const { key, value } of metaobject.fields) {
        if (key === "shipping_label") handle = value;
        if (key === "icon") {
          const temp = value.split(" ");
          icon = temp[0];
          icon_label = temp[1].match(/\((.*?)\)/)?.[1] || temp[1];
        }
        if (key === "icon_label") icon_label = value;
        if (key === "message") message = value;
      }

      if (title.toLowerCase() === handle.toLowerCase()) {
        const item = imageMap[icon.toLowerCase()];
        const label = icon_label || item.label;

        if (item && item.label && item.image) {
          setRenderData({
            label,
            image: item.image,
            message,
          });
        }
      }
    }
  }, [shippingLines]);

  return (
    renderData && (
      <BlockLayout>
        <InlineLayout
          columns={[50, 10, "fill"]}
          inlineAlignment={"start"}
          blockAlignment={"center"}
        >
          <Image source={renderData.image} />
          <InlineSpacer />
          <Text>{renderData.label}</Text>
        </InlineLayout>
        {renderData.message && (
          <BlockLayout>
            {renderData.message.split("\n").map((i, key) => (
              <Text key={key}>{i}</Text>
            ))}
          </BlockLayout>
        )}
      </BlockLayout>
    )
  );
}
