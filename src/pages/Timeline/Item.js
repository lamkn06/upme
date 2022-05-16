import {
  Box,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Grid,
  GridItem,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import { ReactComponent as AngleDownIcon } from '../../images/icons/u_angle-down.svg';
import { ReactComponent as AngleUpIcon } from '../../images/icons/u_angle-up.svg';
import { ReactComponent as CalendarIcon } from '../../images/icons/u_calendar-alt.svg';
import { ReactComponent as TrashIcon } from '../../images/icons/u_trash-alt.svg';

function TimelineItem({ index, remove, defaultIsOpen }) {
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen });
  const { register, watch, control, setValue } = useFormContext();
  const timeline = watch('timeline');

  const endDate = () => {
    if (timeline[index] && timeline[index].isCurrent) return t('Present');
    return timeline[index].endDate ? moment(timeline[index].endDate).format('DD/MM/YYYY') : null;
  };

  return (
    <Box border={'1px solid #C8CFD3'} mt={'16px'} mb={'24px'} p={'16px'}>
      <Flex mb={'4px'}>
        <Flex align={'center'}>
          <Text variant={'displayName'} mr={'4px'}>
            {(() => {
              const time = timeline[index];

              if (time) {
                let res =
                  time.position || t('PositionNumber', { index: index + 1 });

                if (time.company) {
                  res = `${res} ${t('AtCompany', { company: time.company })}`;
                }

                return res;
              }

              return null;
            })()}
          </Text>

          <TrashIcon
            fill={'#C8CFD3'}
            width={'16px'}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              remove(index);
            }}
          />
        </Flex>

        {isOpen ? (
          <AngleUpIcon
            fill={'#C8CFD3'}
            width={'24px'}
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
            onClick={onToggle}
          />
        ) : (
          <AngleDownIcon
            fill={'#C8CFD3'}
            width={'24px'}
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
            onClick={onToggle}
          />
        )}
      </Flex>

      <Text variant={'subtitle2'}>
          <>
            {timeline[index].startDate ? moment(timeline[index].startDate).format('DD/MM/YYYY') : null}
            {timeline[index].startDate &&
            (timeline[index].endDate || timeline[index].isCurrent)
            && ' - '}
            {endDate()}
          </>
      </Text>

      <Collapse in={isOpen} animateOpacity>
        <Grid templateColumns={['1fr', '1fr 1fr']} gap={'16px'} mt={'16px'}>
          <FormControl>
            <FormLabel mb={'4px'}>{t('Position')}</FormLabel>
            <Input
              {...register(`timeline.${index}.position`)}
              borderRadius={2}
              h={'48px'}
            />
          </FormControl>

          <FormControl>
            <FormLabel mb={'4px'}>{t('Company')}</FormLabel>
            <Input
              {...register(`timeline.${index}.company`)}
              borderRadius={2}
              h={'48px'}
            />
          </FormControl>

          <GridItem colSpan={[1, 2]}>
            <Checkbox
              size={'lg'}
              colorScheme={'checkbox_um'}
              {...register(`timeline.${index}.isCurrent`)}
              onChange={(e) => {
                const newVal = e.target.checked;
                setValue(`timeline.${index}.isCurrent`, newVal);
                newVal && setValue(`timeline.${index}.endDate`, '');
              }}
            >
              {t('I am currently working in this role')}
            </Checkbox>
          </GridItem>

          <FormControl>
            <FormLabel fontWeight={400} mr={0}>
              {t('From')}
              <Controller
                render={({ field: { value, onChange } }) => (
                  <InputGroup
                    mt={'4px'}
                    sx={{
                      '.react-datepicker-wrapper': {
                        w: '100%',
                      },
                      '.react-datepicker__day--keyboard-selected': {
                        bg: '#06DCFF',
                        _hover: {
                          bg: '#06DCFF',
                        },
                      },
                      '.react-datepicker__month-select': {
                        _focusVisible: {
                          outlineColor: '#06DCFF',
                        },
                      },
                      '.react-datepicker__year-select': {
                        _focusVisible: {
                          outlineColor: '#06DCFF',
                        },
                      },
                    }}
                  >
                    <Input
                      autoComplete={'off'}
                      borderRadius={2}
                      h={'48px'}
                      as={DatePicker}
                      dateFormat="dd/MM/yyyy"
                      maxDate={timeline[index].endDate || new Date()}
                      showPopperArrow={false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode={'select'}
                      selected={value}
                      onChange={(date) => {
                        onChange(date);
                      }}
                    />
                    <InputRightElement
                      children={<Box as={CalendarIcon} fill={'#C8CFD3'} />}
                      h={'48px'}
                      zIndex={0}
                    />
                  </InputGroup>
                )}
                name={`timeline.${index}.startDate`}
                control={control}
              />
            </FormLabel>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight={400} mr={0}>
              {t('To')}
              <Controller
                render={({ field }) => {
                  return (
                    <InputGroup
                      mt={'4px'}
                      sx={{
                        '.react-datepicker-wrapper': {
                          w: '100%',
                        },
                        '.react-datepicker__day--keyboard-selected': {
                          bg: '#06DCFF',
                          _hover: {
                            bg: '#06DCFF',
                          },
                        },
                        '.react-datepicker__month-select': {
                          _focusVisible: {
                            outlineColor: '#06DCFF',
                          },
                        },
                        '.react-datepicker__year-select': {
                          _focusVisible: {
                            outlineColor: '#06DCFF',
                          },
                        },
                      }}
                    >
                      <Input
                        autoComplete={'off'}
                        borderRadius={2}
                        h={'48px'}
                        as={DatePicker}
                        dateFormat="dd/MM/yyyy"
                        minDate={timeline[index].startDate || undefined}
                        showPopperArrow={false}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode={'select'}
                        isDisabled={timeline[index].isCurrent}
                        selected={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                      />
                      <InputRightElement
                        children={<CalendarIcon fill={'#C8CFD3'} />}
                        h={'48px'}
                        zIndex={0}
                      />
                    </InputGroup>
                  );
                }}
                name={`timeline.${index}.endDate`}
                control={control}
              />
            </FormLabel>
          </FormControl>

          <GridItem colSpan={[1, 2]}>
            <FormControl>
              <FormLabel mb={'4px'}>{t('City')}</FormLabel>
              <Input
                {...register(`timeline.${index}.location`)}
                borderRadius={2}
                h={'48px'}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={[1, 2]}>
            <FormControl>
              <FormLabel mb={'4px'}>{t('Description')}</FormLabel>
              <Box
                sx={{
                  '.quill': {
                    borderTop: '1px solid #ccc',
                    d: 'flex',
                    flexDir: 'column',
                    h: '115px',
                    '.ql-toolbar': {
                      d: 'none',
                      h: '24px',
                      p: '4px',
                      '.ql-formats': {
                        d: 'flex',
                        button: {
                          h: '16px',
                          p: 0,
                          w: 'auto',
                        },
                      },
                    },
                    '.ql-container': {
                      flexGrow: 1,
                      h: '91px',
                    },
                  },
                }}
              >
                <Controller
                  render={({ field }) => {
                    return (
                      <ReactQuill
                        formats={['bold', 'italic', 'underline', 'list', 'indent' ]}
                        modules={{
                          toolbar: [
                            ['bold', 'italic', 'underline', { list: 'bullet' }],
                          ],
                        }}
                        value={field.value}
                        onChange={(text) => {
                          field.onChange(text);
                        }}
                      />
                    );
                  }}
                  name={`timeline.${index}.description`}
                  control={control}
                />
              </Box>
            </FormControl>
          </GridItem>
        </Grid>
      </Collapse>
    </Box>
  );
}

export default TimelineItem;
