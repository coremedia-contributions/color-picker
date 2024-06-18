import ContentPropertyNames from "@coremedia/studio-client.cap-rest-client/content/ContentPropertyNames";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import DomHelper from "@jangaroo/ext-ts/dom/Helper";
import BaseField from "@jangaroo/ext-ts/form/field/Base";
import { as, bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";

interface ColorInputFieldConfig
  extends Config<BaseField>,
    Partial<Pick<ColorInputField, "bindTo" | "propertyName" | "initialColor">> {}

class ColorInputField extends BaseField {
  declare Config: ColorInputFieldConfig;

  #colorInput: HTMLInputElement;

  #propertyValueExpression: ValueExpression;

  constructor(config: Config<ColorInputField> = null) {
    super(ConfigUtils.apply(Config(ColorInputField, {}), config));
    this.initialColor = config.initialColor;
  }

  protected override afterRender(): any {
    super.afterRender();

    this.#propertyValueExpression = this.bindTo.extendBy(ContentPropertyNames.PROPERTIES, this.propertyName);

    const inputEl = DomHelper.createDom({
      tag: "input",
      type: "color",
      value: this.initialColor || "#000000",
    });

    this.#colorInput = as(this.bodyEl.insertFirst(inputEl, true), HTMLInputElement);

    this.#colorInput.addEventListener("change", (event: any) => {
      this.#propertyValueExpression.removeChangeListener(bind(this, this.#updateColorInput));

      const color = event.target.value;
      if (color) {
        this.#propertyValueExpression.setValue(color);
      }

      this.#propertyValueExpression.addChangeListener(bind(this, this.#updateColorInput));
    });

    this.#propertyValueExpression.loadValue(bind(this, this.#updateColorInput));
    this.#propertyValueExpression.addChangeListener(bind(this, this.#updateColorInput));
  }

  #updateColorInput() {
    if (this.#propertyValueExpression) {
      const color = this.#propertyValueExpression.getValue();
      if (color) {
        this.#colorInput.value = color;
      }
    }
  }

  bindTo: ValueExpression = null;

  propertyName: string = null;

  initialColor: string = null;
}

export default ColorInputField;
