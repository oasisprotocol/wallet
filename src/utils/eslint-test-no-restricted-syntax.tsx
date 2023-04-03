/**
 * @file
 * ESLint should detect Google Translate issues with React.
 *
 * Using ESLint's disable directives with reportUnusedDisableDirectives, so
 * these work like "expect eslint error".
 */
/* eslint-disable @typescript-eslint/no-unused-vars */

const condition = true
const bad = 'bad'
const good = 'good'

const textBeforeAndOperator = (
  <div>
    {/* eslint-disable-next-line no-restricted-syntax */}
    <span>
      bad
      {!condition && <span>good</span>}
    </span>
    <span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad.toString()}
      {!condition && <span>good</span>}
    </span>
    <span>
      <span>good</span>
      <span>{good}</span>
      {!condition && <span>good</span>}
    </span>
    <span>
      <span aria-label={condition && good}>good</span>
      <span aria-label={condition && good}>{good}</span>
    </span>
  </div>
)
const textInAndOperator = (
  <div>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition && 'bad'}
    </span>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition && bad}
    </span>
    <span>
      <span>good</span>
      {!condition && <span>good</span>}
      {!condition && <span>{good}</span>}
    </span>
  </div>
)
const textAfterAndOperator = (
  <div>
    <span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition && <span>good</span>}
      bad
    </span>
    <span>
      {!condition && <span>good</span>}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad.toString()}
    </span>
    <span>
      {!condition && <span>good</span>}
      <span>good</span>
      <span>{good}</span>
    </span>
  </div>
)

const textBeforeTernaryOperator = (
  <div>
    {/* eslint-disable-next-line no-restricted-syntax */}
    <span>
      bad
      {!condition ? <span>good</span> : <span>good</span>}
    </span>
    <span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad.toString()}
      {!condition ? <span>good</span> : <span>good</span>}
    </span>
    <span>
      <span>good</span>
      <span>{good}</span>
      {!condition ? <span>good</span> : <span>good</span>}
    </span>
    <span>
      <span aria-label={condition ? good : good}>good</span>
      <span aria-label={condition ? good : good}>{good}</span>
    </span>
  </div>
)
const textInTernaryOperator = (
  <div>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition ? 'bad' : <span>good</span>}
    </span>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition ? <span>good</span> : 'bad'}
    </span>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition ? bad : <span>good</span>}
    </span>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition ? <span>good</span> : bad}
    </span>
    <span>
      <span>good</span>
    </span>
    <span>
      <span>good</span>
      {!condition ? <span>good</span> : <span>good</span>}
      {!condition ? <span>{good}</span> : <span>{good}</span>}
    </span>
  </div>
)
const textAfterTernaryOperator = (
  <div>
    <span>
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition ? <span>good</span> : <span>good</span>}
      bad
    </span>
    <span>
      {!condition ? <span>good</span> : <span>good</span>}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad.toString()}
    </span>
    <span>
      {!condition ? <span>good</span> : <span>good</span>}
      <span>good</span>
      <span>{good}</span>
    </span>
  </div>
)
