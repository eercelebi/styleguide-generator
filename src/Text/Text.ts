import { createColumn, createRow, styleGuideHeader } from "../Helpers/Helpers";

export interface HeadingConfig {
  name: string;
  styles: any;
  mobileOverrides: any;
}

export interface TextConfig {
  name: string;
  styles: any;
}

interface Options {
  styleGuide: FrameNode;
  headings: Array<HeadingConfig>;
  body: Array<TextConfig>;
}

export class Text {

  private _styleGuide: FrameNode;
  private _headings: Array<HeadingConfig>;
  private _body: Array<TextConfig>;
  private _textFrame: FrameNode;

  static init(options: Options) {
    new this(options);
  }

  constructor(options: Options) {
    this._styleGuide = options.styleGuide;
    this._headings = options.headings;
    this._body = options.body
    this._textFrame = createRow('Texts', 80);

    this.buildHeadingsFrame();
    this.buildBodyFrame();
    this.appendToStyleGuide();
  }

  private buildHeadingsFrame() {
    const headingsFrame = createColumn('Headings', 25);
    headingsFrame.appendChild(styleGuideHeader('Headings'));

    for (const heading of this._headings) {
      const row = createRow(`Heading ${heading.name}`, 175);
      row.primaryAxisAlignItems = 'SPACE_BETWEEN';
      row.counterAxisAlignItems = 'CENTER';
      row.paddingTop = 16;
      row.paddingBottom = 16;

      const desktopStyles = heading.styles;

      const desktopHeading = this.buildTextNode(desktopStyles, heading.name, `${heading.name}/D`);
      const mobileHeading = this.buildTextNode(Object.assign(desktopStyles, heading.mobileOverrides), heading.name, `${heading.name}/P`);

      row.appendChild(desktopHeading);
      row.appendChild(mobileHeading);
      headingsFrame.appendChild(row);
    }
    this._textFrame.appendChild(headingsFrame);
  }

  private buildBodyFrame() {
    const bodyFrame = createColumn('Body Styles', 25);
    bodyFrame.appendChild(styleGuideHeader('Body Styles'));

    for (const body of  this._body) {
      const row = createRow(`Body ${body.name}`, 0);
      row.paddingTop = 16;
      row.paddingBottom = 16;

      const { styles } = body;

      const bodyText = this.buildTextNode(styles, body.name, `Body/${body.name}`);

      row.appendChild(bodyText);
      bodyFrame.appendChild(row);
    }
    this._textFrame.appendChild(bodyFrame);
  }

  private buildTextNode(styles: any, name: string, characters: string): TextNode {
    const text = figma.createText();
    text.characters = characters;
    text.fontSize = styles.fontSize;
    if (styles.fontWeight == 700) {
      text.fontName = {
        family: 'Roboto',
        style: 'Bold'
      }
    }
    text.letterSpacing = {
      value: styles.letterSpacing || 0,
      unit: 'PIXELS'
    }
    text.lineHeight = {
      value: styles.lineHeight,
      unit: 'PIXELS'
    }
    
    return text;
  }

  private appendToStyleGuide() {
    this._styleGuide.appendChild(this._textFrame);
  }
}