import ContentPropertyNames from "@coremedia/studio-client.cap-rest-client/content/ContentPropertyNames";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import AdvancedFieldContainer from "@coremedia/studio-client.ext.ui-components/components/AdvancedFieldContainer";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import PropertyFieldPlugin from "@coremedia/studio-client.main.editor-components/sdk/premular/PropertyFieldPlugin";
import BindReadOnlyPlugin
  from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/plugins/BindReadOnlyPlugin";
import SetPropertyLabelPlugin
  from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/plugins/SetPropertyLabelPlugin";
import DisplayField from "@jangaroo/ext-ts/form/field/Display";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import ColumnLayout from "@jangaroo/ext-ts/layout/container/Column";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import ColorPicker_properties from "../ColorPicker_properties";
import ColorInputField from "./ColorInputField";
import TextLinkButton from "./TextLinkButton";

interface ColorPickerPropertyFieldConfig extends Config<AdvancedFieldContainer>, Partial<Pick<ColorPickerPropertyField,
  "bindTo" |
  "forceReadOnlyValueExpression" |
  "propertyName" |
  "hideIssues" |
  "initialColor" |
  "textFieldHidden" |
  "displayFieldHidden"
>> {}

class ColorPickerPropertyField extends AdvancedFieldContainer {

  declare Config: ColorPickerPropertyFieldConfig;

  constructor(config: Config<ColorPickerPropertyField> = null) {
    super((() => ConfigUtils.apply(Config(ColorPickerPropertyField, {
      items: [
        Config(ColorInputField, {
          bindTo: config.bindTo,
          propertyName: config.propertyName,
          initialColor: config.initialColor,
        }),
        Config(TextField, {
          margin: "0 6",
          hidden: config.textFieldHidden,
          plugins: [
            Config(BindPropertyPlugin, {
              bindTo: config.bindTo.extendBy(ContentPropertyNames.PROPERTIES, config.propertyName),
              bidirectional: true,
              ifUndefined: config.initialColor,
            }),
          ],
        }),
        Config(DisplayField, {
          margin: "0 6",
          hidden: ColorPickerPropertyField.#calculateDisplayFieldHidden(config),
          plugins: [
            Config(BindPropertyPlugin, {
              bindTo: config.bindTo.extendBy(ContentPropertyNames.PROPERTIES, config.propertyName),
              ifUndefined: config.initialColor,
            }),
          ],
        }),
        Config(TextLinkButton, {
          text: ColorPicker_properties.ColorPickerPropertyField_reset_text,
          handler: bind(this, () => {
            this.#resetColor();
          }),
        }),
      ],
      plugins: [
        Config(SetPropertyLabelPlugin, {
          bindTo: config.bindTo,
          propertyName: config.propertyName,
        }),
        Config(BindReadOnlyPlugin, {
          forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
          bindTo: config.bindTo,
        }),
        Config(PropertyFieldPlugin, { propertyName: config.propertyName }),
      ],
      layout: Config(ColumnLayout),
    }), config))());
    this.initialColor = config.initialColor;
  }

  /**
   * a property path expression leading to the Bean whose property is edited.
   * This property editor assumes that this bean has a property 'properties'.
   */
  bindTo: ValueExpression = null;

  /**
   * An optional ValueExpression which makes the component read-only if it is evaluated to true.
   */
  forceReadOnlyValueExpression: ValueExpression = null;

  /** the property of the Bean to bind in this field */
  propertyName: string = null;

  /** Don't show any validation issues on this property field. */
  hideIssues: boolean = false;

  initialColor: string = null;

  /** Don't show the text input field. */
  textFieldHidden: boolean = false;

  /** Don't show the display field. (only applies if textFieldHidden is true) */
  displayFieldHidden: boolean = true;

  #resetColor(): void {
    this.bindTo.extendBy(ContentPropertyNames.PROPERTIES, this.propertyName).setValue(this.initialColor);
  }

  static #calculateDisplayFieldHidden(config: ColorPickerPropertyFieldConfig): boolean {
    let result = true;
    if (config.textFieldHidden) {
      result = config.displayFieldHidden;
    }
    return result;
  }

}

export default ColorPickerPropertyField;
