import {
  reactExtension,
  Text,
  useShippingOptionTarget,
  Image,
  useSettings,
  InlineLayout,
  InlineSpacer,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.shipping-option-item.render-after", () => (
  <Extension />
));

function Extension() {
  const { shippingOptionTarget } = useShippingOptionTarget();
  const { title: rawTitle } = shippingOptionTarget;
  const title = rawTitle.replace(/®/g, '');
  const { shipping_info } = useSettings();
  const _shipping_info = shipping_info.split(/\r?\n|\r/);

  const imageMap = {
    snail: {
      image: "https://cdn.shopify.com/s/files/1/0063/9900/0643/files/FM_-_Shipping_Icons_-_Single_Color_-_100_x_100_-_resized-05.png?v=1731533548",
      label: "EcoSaver"
    },
    turtle: {
      image: "https://cdn.shopify.com/s/files/1/0063/9900/0643/files/FM_-_Shipping_Icons_-_Single_Color_-_100_x_100_-_resized-06.png?v=1731533548",
      label: "EcoSpeed"
    },
    bunny: {
      image: "https://cdn.shopify.com/s/files/1/0063/9900/0643/files/FM_-_Shipping_Icons_-_Single_Color_-_100_x_100_-_resized-07.png?v=1731533548",
      label: "Expedited Shipping"
    },
    bird: {
      image: "https://cdn.shopify.com/s/files/1/0063/9900/0643/files/FM_-_Shipping_Icons_-_Single_Color_-_100_x_100_-_resized-08.png?v=1731533548",
      label: "Express Shipping"
    },
  };

  let imgUrl: string, label: string = '';
  for (const info of _shipping_info) {
    const split = info.split("|");

    if (title.toLowerCase() == split[0].toLowerCase()) {
      const item = imageMap[split[1].toLowerCase()];

      if (item && item.label && item.image) {
        imgUrl = item.image;
        label = item.label;
      }
    }
  }

  return label && imgUrl && (
    <InlineLayout columns={[50, 10, "fill"]} inlineAlignment={'start'} blockAlignment={'center'}>
      <Image source={imgUrl} />
      <InlineSpacer />
      <Text>{label}</Text>
    </InlineLayout>
  );
}
