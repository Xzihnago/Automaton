const operators: Record<string, number> = {
  "!": 3,
  "~": 3,
  "**": 4,
  "*": 5,
  "/": 5,
  "%": 5,
  "+": 6,
  "-": 6,
  "<<": 7,
  ">>": 7,
  "<": 9,
  ">": 9,
  "<=": 9,
  ">=": 9,
  "==": 10,
  "!=": 10,
  "&": 11,
  "^": 12,
  "|": 13,
  "&&": 14,
  "||": 15,
};

const getExpressionArray = (expression: string) =>
  expression.match(
    /[\w.]+|\(-[\w.]+\)|[()!~^/%+-]|\*\*?|\|\|?|&&?|>=?|<=?|>>|<<|==|!=/g,
  ) ?? [];

const getExpressionString = (tokenArray: string[]) =>
  tokenArray
    .join(" ")
    .replace(/\( /g, "(")
    .replace(/ \)/g, ")")
    .replace(/\s+/g, " ");

const getExpressionNotation = (tokenArray: string[]) => {
  if (tokenArray[0] in operators) return "prefix";
  else if (tokenArray[tokenArray.length - 1] in operators) return "postfix";
  else return "infix";
};

const convertNotation = (
  tokenArray: string[],
  original: "infix" | "postfix" | "prefix",
  target: "infix" | "postfix" | "prefix",
) => {
  // Return token array if token notation is the same as target notation
  if (original === target) return tokenArray;

  // Define variables
  const targetArray: string[] = [];
  const tokenStack: string[] = [];

  // Infix => Postfix | Prefix
  if (original === "infix") {
    tokenArray =
      target === "postfix" ? tokenArray : tokenArray.slice().reverse();
    const [startBracket, endBracket] =
      target === "postfix" ? ["(", ")"] : [")", "("];

    for (const token of tokenArray) {
      // If token is end bracket
      if (token === endBracket) {
        while (
          tokenStack.length &&
          tokenStack[tokenStack.length - 1] !== startBracket
        ) {
          targetArray.push(tokenStack.pop() ?? "");
        }
        tokenStack.pop();
      }
      // If token is start bracket
      else if (token === startBracket) {
        tokenStack.push(token);
      }
      // If token is operator
      else if (token in operators) {
        while (
          operators[tokenStack[tokenStack.length - 1]] <= operators[token]
        ) {
          targetArray.push(tokenStack.pop() ?? "");
        }
        tokenStack.push(token);
      }
      // If token is operand
      else {
        targetArray.push(token);
      }
    }
    while (tokenStack.length) {
      targetArray.push(tokenStack.pop() ?? "");
    }

    if (target === "prefix") targetArray.reverse();
  }

  // Postfix => Infix | Prefix
  else if (original === "postfix") {
    for (const token of tokenArray) {
      if (token in operators) {
        const expRight = tokenStack.pop() ?? "";
        const expLeft = tokenStack.pop() ?? "";

        // If target notation is infix
        if (target === "infix") {
          let resR = expRight;
          let resL = expLeft;

          const spaceIndexR = expRight.indexOf(" ");
          if (spaceIndexR !== -1) {
            const opR = expRight.substring(0, spaceIndexR);
            const expR = expRight.substring(spaceIndexR + 1);
            resR = operators[token] > operators[opR] ? expR : `(${expR})`;
          }

          const spaceIndexL = expLeft.indexOf(" ");
          if (spaceIndexL !== -1) {
            const opL = expLeft.substring(0, spaceIndexL);
            const expL = expLeft.substring(spaceIndexL + 1);
            resL = operators[token] >= operators[opL] ? expL : `(${expL})`;
            if (token === "!" || token === "~") resL = `${resL} ${opL}`;
          }

          tokenStack.push(`${token} ${resL} ${token} ${resR}`);
          console.log(token, tokenStack, "\n");
        }

        // If target notation is prefix
        else {
          tokenStack.push(`${token} ${expLeft} ${expRight}`);
        }
      } else {
        tokenStack.push(token);
      }
    }

    targetArray.push(tokenStack.pop() ?? "");
    if (target === "infix")
      targetArray[0] = targetArray[0].substring(
        targetArray[0].indexOf(" ") + 1,
      );
  }

  return targetArray;
};

export default {
  getExpressionArray,
  getExpressionString,
  getExpressionNotation,
  convertNotation,
};
