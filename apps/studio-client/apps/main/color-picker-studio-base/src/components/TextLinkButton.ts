import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import Button from "@jangaroo/ext-ts/button/Button";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";

interface TextLinkButtonConfig extends Config<Button> {
}

class TextLinkButton extends Button {
  declare Config: TextLinkButtonConfig;

  static override readonly xtype: string = "com.coremedia.blueprint.studio.config.taxonomy.textLinkButton";

  constructor(config: Config<TextLinkButton> = null) {
    super(ConfigUtils.apply(Config(TextLinkButton, {
      scale: "small",
      ui: ButtonSkin.SIMPLE.getSkin(),

    }), config));
  }

}

export default TextLinkButton;
