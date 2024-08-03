/**
 * @file
 * ESLint should detect Google Translate issues with React.
 *
 * Using ESLint's disable directives with reportUnusedDisableDirectives, so
 * these work like "expect eslint error".
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */

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
      {!condition && (
        // eslint-disable-next-line no-restricted-syntax
        <>
          bad <span>good</span>
        </>
      )}
    </span>
    <span>
      <span>good</span>
      <span>{good}</span>
      {!condition && <span>good</span>}
      {!condition && (
        <>
          <span>good</span>
          <span>good</span>
        </>
      )}
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
    good
    {good}
    {/* good */}
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
    good
    {good}
    {/* good */}
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
      {!condition ? (
        // eslint-disable-next-line no-restricted-syntax
        <>
          bad
          <span>good</span>
        </>
      ) : (
        // eslint-disable-next-line no-restricted-syntax
        <>
          bad
          <span>good</span>
        </>
      )}
    </span>
    <span>
      <span>good</span>
      {!condition ? <span>good</span> : <span>good</span>}
      {!condition ? <span>{good}</span> : <span>{good}</span>}
      {!condition ? (
        <>
          <span>good</span>
          <span>good</span>
        </>
      ) : (
        <>
          <span>good</span>
          <span>good</span>
        </>
      )}
    </span>
  </div>
)
const textAfterTernaryOperator = (
  <div>
    {/* eslint-disable-next-line no-restricted-syntax */}
    <span>
      bad
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition ? <span>good</span> : <span>good</span>}
      bad
    </span>
    good
    {good}
    {/* good */}
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

function TextInFragment() {
  const Arrow1 = () => <>{condition && <span>good</span>}</>
  /* eslint-disable-next-line no-restricted-syntax */
  const Arrow2 = () => <>{!condition ? <span>good</span> : 'bad'}</>

  return (
    <>
      {/* good */}
      {condition ? <Arrow1 /> : <Arrow2 />}
      {condition && <span>good</span>}
      {!condition ? <span>good</span> : <span>good</span>}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {!condition ? <span>good</span> : 'bad'}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {'bad'}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad}
      {/* eslint-disable-next-line no-restricted-syntax */}
      {bad.toString()}
    </>
  )
}

const nestedConditionsAreNotSupported = (
  <div>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax -- Unsupported */}
      {!condition ? <span>good</span> : !condition ? <span>good</span> : <span>good</span>}
    </span>
    <span>
      {/* eslint-disable-next-line no-restricted-syntax -- Unsupported */}
      {!condition ? <span>good</span> : !condition ? <span>good</span> : <span>good</span>}
      bad
    </span>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax -- Unsupported */}
      {!condition ? <span>good</span> : !condition && <span>good</span>}
    </span>
    <span>
      <span>good</span>
      {/* eslint-disable-next-line no-restricted-syntax -- Unsupported */}
      {!condition ? <span>good</span> : !condition && 'bad'}
    </span>
    <span>
      <span>good</span>
      {!condition ? (
        <span>good</span>
      ) : // eslint-disable-next-line no-restricted-syntax -- Unsupported
      !condition ? (
        <span>good</span>
      ) : !condition ? (
        <>
          bad
          <span>good</span>
        </>
      ) : (
        true && 'bad'
      )}
    </span>
  </div>
)
