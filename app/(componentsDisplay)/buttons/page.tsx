'use client';
import Image from 'next/image';
import { Button, ButtonVariant } from 'morning-react-ui/components/buttons';
import buttonStyles from 'morning-react-ui/components/buttons/button.module.css';
import LinkButton from 'morning-react-ui/components/buttons/LinkButton';
import Column from 'morning-react-ui/components/layout/Column';
import Columns from 'morning-react-ui/components/layout/Columns';
import Container from 'morning-react-ui/components/layout/Container';
import Navigation from 'morning-react-ui/components/layout/Navigation';
import { Size, sizeToNumber } from 'morning-react-ui/utils/Enum';

export default function Page() {
  const handleClick = () => {
    alert('yeah');
  };

  const getImage = (size: Size) => (
    <Image
      className={buttonStyles.image}
      src={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}logos/logo_google.png`}
      alt='Google logo'
      width={sizeToNumber(size)}
      height={sizeToNumber(size)}
    />
  );

  // eslint-disable-next-line complexity
  const renderButtons = (
    props: {
      isLoading?: boolean;
      className?: string;
      variant?: ButtonVariant;
      disabled?: boolean;
    },
    hasStartImage: undefined | true = undefined,
    hasEndImage: undefined | true = undefined,
    content = <>Button</>,
  ) => {
    return (
      <>
        <Button
          onClick={handleClick}
          {...props}
          startImage={hasStartImage && getImage(Size.m)}
          endImage={hasEndImage && getImage(Size.m)}
        >
          {content}
        </Button>
        <Button
          onClick={handleClick}
          {...props}
          startImage={hasStartImage && getImage(Size.l)}
          endImage={hasEndImage && getImage(Size.l)}
          size={Size.l}
        >
          {content}
        </Button>
        <Button
          onClick={handleClick}
          {...props}
          startImage={hasStartImage && getImage(Size.m)}
          endImage={hasEndImage && getImage(Size.m)}
          size={Size.m}
        >
          {content}
        </Button>
        <Button
          onClick={handleClick}
          {...props}
          startImage={hasStartImage && getImage(Size.s)}
          endImage={hasEndImage && getImage(Size.s)}
          size={Size.s}
        >
          {content}
        </Button>
        <Button
          onClick={handleClick}
          {...props}
          startImage={hasStartImage && getImage(Size.xs)}
          endImage={hasEndImage && getImage(Size.xs)}
          size={Size.xs}
        >
          {content}
        </Button>
      </>
    );
  };

  // eslint-disable-next-line complexity
  const renderLinkButtons = (
    props: {
      isLoading?: boolean;
      className?: string;
      variant?: ButtonVariant;
      disabled?: boolean;
    },
    hasStartImage: undefined | true = undefined,
    hasEndImage: undefined | true = undefined,
    content = <>Button</>,
  ) => {
    return (
      <>
        <LinkButton
          onClick={handleClick}
          {...props}
          startImageURL={
            hasStartImage &&
            `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/plus.svg`
          }
          endImageURL={
            hasEndImage &&
            `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/arrow-up-right-from-square.svg`
          }
        >
          {content}
        </LinkButton>
        <LinkButton
          onClick={handleClick}
          startImageURL={
            hasStartImage &&
            `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/plus.svg`
          }
          endImageURL={
            hasEndImage &&
            `${process.env.NEXT_PUBLIC_MORNING_CDN_URL}}icons/arrow-up-right-from-square.svg`
          }
          size={Size.l}
          startImageClassName={buttonStyles.coloredLinkButtonImage}
        >
          {content}
        </LinkButton>
        <LinkButton
          onClick={handleClick}
          {...props}
          startImageURL={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/plus.svg`}
          endImageURL={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/arrow-up-right-from-square.svg`}
          startImageClassName={buttonStyles.coloredLinkButtonImage}
          endImageClassName={buttonStyles.rotatedImage}
          size={Size.m}
        >
          {content}
        </LinkButton>
        <LinkButton
          onClick={handleClick}
          {...props}
          startImageURL={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/plus.svg`}
          endImageURL={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/arrow-up-right-from-square.svg`}
          size={Size.s}
        >
          {content}
        </LinkButton>
        <LinkButton
          onClick={handleClick}
          {...props}
          startImageURL={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}icons/plus.svg`}
          endImageURL={`${process.env.NEXT_PUBLIC_MORNING_CDN_URL}}icons/arrow-up-right-from-square.svg`}
          size={Size.xs}
        >
          {content}
        </LinkButton>
      </>
    );
  };

  return (
    <>
      <Navigation>
        <h1 className={'font-size-xl'}>Buttons</h1>
      </Navigation>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Container>
          <h1>Buttons</h1>
          <Columns>
            <Column>
              {renderButtons({})}
              {renderButtons({}, true)}
              {renderButtons({}, true, true)}
              {renderButtons({}, true, undefined, <></>)}
              {renderButtons({ isLoading: true })}
            </Column>
            <Column>
              {renderButtons({ disabled: true })}
              {renderButtons({ disabled: true }, true)}
              {renderButtons({ disabled: true }, true, true)}
              {renderButtons({ disabled: true }, true, undefined, <></>)}
              {renderButtons({ disabled: true, isLoading: true })}
            </Column>
            <Column>
              {renderButtons({ variant: ButtonVariant.Secondary })}
              {renderButtons({ variant: ButtonVariant.Secondary }, true)}
              {renderButtons({ variant: ButtonVariant.Secondary }, true, true)}
              {renderButtons(
                { variant: ButtonVariant.Secondary },
                true,
                undefined,
                <></>,
              )}
              {renderButtons({
                variant: ButtonVariant.Secondary,
                isLoading: true,
              })}
            </Column>
            <Column>
              {renderButtons({
                variant: ButtonVariant.Secondary,
                disabled: true,
              })}
              {renderButtons(
                { variant: ButtonVariant.Secondary, disabled: true },
                true,
              )}
              {renderButtons(
                { variant: ButtonVariant.Secondary, disabled: true },
                true,
                true,
              )}
              {renderButtons(
                { variant: ButtonVariant.Secondary, disabled: true },
                true,
                undefined,
                <></>,
              )}
              {renderButtons({
                variant: ButtonVariant.Secondary,
                disabled: true,
                isLoading: true,
              })}
            </Column>
            <Column>
              {renderButtons({ variant: ButtonVariant.Danger })}
              {renderButtons({ variant: ButtonVariant.Danger }, true)}
              {renderButtons({ variant: ButtonVariant.Danger }, true, true)}
              {renderButtons(
                { variant: ButtonVariant.Danger },
                true,
                undefined,
                <></>,
              )}
              {renderButtons({
                variant: ButtonVariant.Danger,
                isLoading: true,
              })}
            </Column>
            <Column>
              {renderLinkButtons({})}
              {renderLinkButtons({}, true)}
              {renderLinkButtons({}, true, true)}
              {renderLinkButtons({}, true, undefined, <></>)}
            </Column>
            <Column>
              {renderLinkButtons({ disabled: true })}
              {renderLinkButtons({ disabled: true }, true)}
              {renderLinkButtons({ disabled: true }, true, true)}
              {renderLinkButtons({ disabled: true }, true, undefined, <></>)}
            </Column>
          </Columns>
        </Container>
      </div>
    </>
  );
}
