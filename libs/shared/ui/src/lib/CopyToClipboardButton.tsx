import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiCopy } from 'react-icons/fi';

type Props = {
  onPress: () => void;
  hasCopied: boolean;
  disabled?: boolean;
};

export const CopyToClipboardButton: FC<Props> = ({
  hasCopied,
  onPress,
  disabled,
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip label={t('copyToClipboard')}>
      <IconButton
        disabled={disabled}
        icon={<Icon as={hasCopied ? FiCheck : FiCopy} />}
        aria-label={t('copyToClipboard')}
        size={'sm'}
        onClick={onPress}
      />
    </Tooltip>
  );
};

export default CopyToClipboardButton;
