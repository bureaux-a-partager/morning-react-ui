import {
  ChangeEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import inputStyle from 'morning-react-ui/components/inputs/input.module.css';
import { useModal } from 'morning-react-ui/components/modals';
import { stripHtml } from 'morning-react-ui/utils';
import ParentInput from '../ParentInput';
import { InputProps } from '../propsTypes';
import ActivationButton from './ActivationButton';
import { ControlClickLink } from './ControlClickLink';
import LinkModal from './LinkModal';
import styles from './richText.module.css';

type RichTextProps = InputProps & {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxCharacter?: number;
};

const RichText = forwardRef<HTMLInputElement, RichTextProps>(
  (
    {
      value,
      onChange,
      label,
      sublabel,
      size,
      isLabelBold,
      disabled,
      placeholder,
      className,
      isError,
      maxCharacter,
    },
    ref,
  ) => {
    const editorContentRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(
      ref,
      () => editorContentRef.current as HTMLInputElement,
    );

    const textEditor = useEditor({
      extensions: [
        StarterKit,
        HardBreak.extend({
          addKeyboardShortcuts() {
            return {
              Enter: () => this.editor.commands.setHardBreak(),
            };
          },
        }),
        Underline,
        ControlClickLink.configure({ openOnClick: false }).extend({
          inclusive: false,
        }),
        Placeholder.configure({
          placeholder: placeholder,
          showOnlyWhenEditable: true,
          showOnlyCurrent: true,
        }),
      ],
      content: value ? `${value}` : '',
      onUpdate: ({ editor: innerEditor }) => {
        const html = innerEditor.getHTML();
        const textContent = stripHtml(html);
        if (!maxCharacter || textContent.length <= maxCharacter) {
          const fakeEvent = {
            currentTarget: { value: html },
            target: { value: html },
          } as unknown as ChangeEvent<HTMLInputElement>;
          onChange(fakeEvent);
        } else {
          innerEditor.commands.setContent(value);
        }
      },
    });

    useEffect(() => {
      if (textEditor && value !== textEditor.getHTML()) {
        textEditor.commands.setContent(`${value}`);
      }
    }, [value, textEditor]);

    const { handleShowModal, isModalShowing, hideModal } = useModal();

    if (!textEditor) {
      return <div></div>;
    }

    const handleWrapperClick = () => {
      if (!disabled) {
        textEditor.commands.focus();
      }
    };

    return (
      <ParentInput
        label={label}
        sublabel={sublabel}
        isLabelBold={isLabelBold}
        size={size}
        inputRef={editorContentRef}
        disabled={disabled}
        onClick={handleWrapperClick}
      >
        <div
          className={classNames(
            inputStyle.wrapper,
            styles.richTextWrapper,
            { ['cursorText']: !disabled },
            {
              [inputStyle.error]: isError,
            },
            className,
          )}
          onClick={handleWrapperClick}
        >
          <style>
            {`
            .ProseMirror {
                outline: none;
                white-space: pre-wrap;
                word-break: break-word;
                overflow-wrap: break-word;
                max-width: 100%;
            }
            .ProseMirror:focus {
                outline: none;
            }
            .tiptap p.is-editor-empty:first-child::before {
                color: #adb5bd;
                content: attr(data-placeholder);
                float: left;
                height: 0;
                pointer-events: none;
            }
        `}
          </style>
          <EditorContent
            editor={textEditor}
            ref={editorContentRef}
            className={styles.editorContentContainer}
          />
          <div className={styles.controls}>
            <ActivationButton
              onClick={() => textEditor.chain().focus().toggleItalic().run()}
              isActive={textEditor.isActive('italic')}
              disabled={disabled}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/italic.svg`}
                alt='Italic'
                width={24}
                height={24}
              />
            </ActivationButton>
            <ActivationButton
              onClick={() => textEditor.chain().focus().toggleBold().run()}
              isActive={textEditor.isActive('bold')}
              disabled={disabled}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/bold.svg`}
                alt='Bold'
                width={24}
                height={24}
              />
            </ActivationButton>
            <ActivationButton
              onClick={() => textEditor.chain().focus().toggleStrike().run()}
              isActive={textEditor.isActive('strike')}
              disabled={disabled}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/strike.svg`}
                alt='Strike'
                width={24}
                height={24}
              />
            </ActivationButton>
            <ActivationButton
              onClick={() => textEditor.chain().focus().toggleUnderline().run()}
              isActive={textEditor.isActive('underline')}
              disabled={disabled}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/underline.svg`}
                alt='Strike'
                width={24}
                height={24}
              />
            </ActivationButton>
            <ActivationButton
              onClick={() => handleShowModal()}
              isActive={textEditor.isActive('link')}
              disabled={disabled}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/link.svg`}
                alt='Strike'
                width={24}
                height={24}
              />
            </ActivationButton>
          </div>
        </div>
        <LinkModal
          editor={textEditor}
          isModalShowing={isModalShowing}
          hideModal={hideModal}
        />
      </ParentInput>
    );
  },
);

RichText.displayName = 'RichText';

export default RichText;
