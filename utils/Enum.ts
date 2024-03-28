export const enum Size {
  xs = 'xs',
  s = 's',
  m = 'm',
  l = 'l',
  xl = 'xl',
}

export function sizeToNumber(size: Size): number {
  switch (size) {
    case Size.xl:
      return 26;
    case Size.l:
      return 24;
    case Size.m:
      return 20;
    case Size.s:
      return 16;
    case Size.xs:
      return 12;
  }
}

export function sizeToFontSize(size: Size): number {
  switch (size) {
    case Size.xl:
      return 18;
    case Size.l:
      return 16;
    case Size.m:
      return 14;
    case Size.s:
      return 12;
    case Size.xs:
      return 10;
  }
}

export function sizeToGap(size: Size) {
  switch (size) {
    case Size.xl:
      return 26;
    case Size.l:
      return 24;
    case Size.m:
      return 16;
    case Size.s:
      return 12;
    case Size.xs:
      return 8;
  }
}

export function sizeToHeight(size: Size) {
  switch (size) {
    case Size.xl:
      return 42;
    case Size.l:
      return 36;
    case Size.m:
      return 30;
    case Size.s:
      return 24;
    case Size.xs:
      return 18;
  }
}
