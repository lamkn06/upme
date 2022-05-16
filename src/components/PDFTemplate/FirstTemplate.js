import Roboto from '@fontsource/roboto/files/roboto-vietnamese-500-normal.woff';
import {
  Document,
  Font,
  Image,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer';
import format from 'date-fns/format';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useTranslation } from 'react-i18next';
import useLanguageLevels from '../../hooks/useLanguageLevels';
import { sortTimeline, sortEducation } from '../../utils/profileUtils';

const maxSkillLevel = 5;

const MyDocument = ({ profile }) => {
  const { t } = useTranslation();
  const languagesLevels = useLanguageLevels();
  const {
    educations = [],
    email = '',
    fullName = '',
    languages = [],
    location = '',
    personalStatement = '',
    phoneNumber = '',
    position = '',
    profilePicture = '',
    showLevel,
    skills = [],
    timeline = [],
  } = profile;

  return (
    <Document>
      <Page style={styles.body}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#06DCFF',
            flexDirection: 'row',
            fontFamily: 'Roboto',
            padding: '24px',
          }}
        >
          {profilePicture ? (
            <Image
              src={profilePicture}
              style={{
                borderRadius: '100%',
                height: '100px',
                width: '100px',
                marginRight: '16px',
              }}
            />
          ) : null}

          <View>
            <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {fullName}
            </Text>

            <Text style={{ paddingTop: '8px' }}>{position}</Text>
          </View>
        </View>

        {email || location || phoneNumber ? (
          <View
            style={{
              borderBottom: '1px solid lightgray',
              flexDirection: 'column',
              fontFamily: 'Roboto',
              fontSize: '12px',
              paddingTop: '16px',
              paddingBottom: '16px',
              marginLeft: '24px',
              marginRight: '24px',
            }}
          >
            {email ? (
              <View style={{ flexDirection: 'row' }}>
                <Svg width="20" height="15" viewBox="0 0 24 24" fill="#06DCFF">
                  <Path
                    d="M19 4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4ZM18.59 6L12.71 11.88C12.617 11.9737 12.5064 12.0481 12.3846 12.0989C12.2627 12.1497 12.132 12.1758 12 12.1758C11.868 12.1758 11.7373 12.1497 11.6154 12.0989C11.4936 12.0481 11.383 11.9737 11.29 11.88L5.41 6H18.59ZM20 17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H5C4.73478 18 4.48043 17.8946 4.29289 17.7071C4.10536 17.5196 4 17.2652 4 17V7.41L9.88 13.29C10.4425 13.8518 11.205 14.1674 12 14.1674C12.795 14.1674 13.5575 13.8518 14.12 13.29L20 7.41V17Z"
                    fill="#06DCFF"
                  />
                </Svg>

                <Text style={{ marginLeft: '3px' }}>{email}</Text>
              </View>
            ) : null}

            {location ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '12px',
                }}
              >
                <Svg width="20" height="15" viewBox="0 0 24 24" fill="#06DCFF">
                  <Path
                    d="M17.9999 4.47991C16.4086 2.88861 14.2504 1.99463 11.9999 1.99463C9.74949 1.99463 7.59123 2.88861 5.99993 4.47991C4.40863 6.07121 3.51465 8.22947 3.51465 10.4799C3.51465 12.7303 4.40863 14.8886 5.99993 16.4799L11.2699 21.7599C11.3629 21.8536 11.4735 21.928 11.5954 21.9788C11.7172 22.0296 11.8479 22.0557 11.9799 22.0557C12.1119 22.0557 12.2426 22.0296 12.3645 21.9788C12.4864 21.928 12.597 21.8536 12.6899 21.7599L17.9999 16.4299C19.5846 14.8452 20.4748 12.696 20.4748 10.4549C20.4748 8.21386 19.5846 6.06459 17.9999 4.47991ZM16.5699 14.9999L11.9999 19.5899L7.42993 14.9999C6.52707 14.0962 5.91241 12.9452 5.66362 11.6922C5.41484 10.4392 5.54312 9.14066 6.03223 7.96059C6.52135 6.78052 7.34935 5.77196 8.41156 5.06239C9.47377 4.35281 10.7225 3.97409 11.9999 3.97409C13.2773 3.97409 14.5261 4.35281 15.5883 5.06239C16.6505 5.77196 17.4785 6.78052 17.9676 7.96059C18.4567 9.14066 18.585 10.4392 18.3362 11.6922C18.0875 12.9452 17.4728 14.0962 16.5699 14.9999ZM8.99993 7.40991C8.19264 8.21968 7.73932 9.31648 7.73932 10.4599C7.73932 11.6033 8.19264 12.7001 8.99993 13.5099C9.59969 14.1107 10.3635 14.521 11.1956 14.6893C12.0276 14.8576 12.8909 14.7765 13.677 14.4561C14.4631 14.1356 15.1371 13.5902 15.6144 12.8882C16.0917 12.1861 16.3511 11.3588 16.3599 10.5099C16.3644 9.94311 16.2553 9.38117 16.0388 8.8573C15.8224 8.33343 15.5032 7.85827 15.0999 7.45991C14.7036 7.05449 14.231 6.73145 13.7094 6.50938C13.1877 6.2873 12.6273 6.17059 12.0603 6.16594C11.4934 6.16129 10.9311 6.26881 10.4059 6.4823C9.88067 6.69579 9.40285 7.01104 8.99993 7.40991ZM13.6899 12.0899C13.311 12.4747 12.8101 12.7158 12.2731 12.7722C11.736 12.8285 11.196 12.6966 10.7454 12.3988C10.2949 12.1011 9.96173 11.6562 9.80294 11.14C9.64415 10.6238 9.66958 10.0685 9.87489 9.56907C10.0802 9.06958 10.4526 8.65693 10.9285 8.40165C11.4044 8.14637 11.9542 8.06432 12.4839 8.16953C13.0135 8.27474 13.4902 8.56067 13.8324 8.97844C14.1746 9.39621 14.3611 9.91988 14.3599 10.4599C14.3454 11.0772 14.0864 11.6634 13.6399 12.0899H13.6899Z"
                    fill="#06DCFF"
                  />
                </Svg>

                <Text style={{ marginLeft: '3px' }}>{location}</Text>
              </View>
            ) : null}

            {phoneNumber ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '12px',
                }}
              >
                <Svg
                  width="20"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="#06DCFF"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M19.4401 13.0001C19.2201 13.0001 18.9901 12.9301 18.7701 12.8801C18.3246 12.7819 17.8868 12.6516 17.4601 12.4901C16.9962 12.3213 16.4862 12.3301 16.0284 12.5147C15.5706 12.6993 15.1972 13.0467 14.9801 13.4901L14.7601 13.9401C13.7861 13.3983 12.8911 12.7253 12.1001 11.9401C11.3149 11.1491 10.6419 10.2541 10.1001 9.28011L10.5201 9.00011C10.9635 8.78303 11.3109 8.40964 11.4955 7.9518C11.6801 7.49396 11.6889 6.98402 11.5201 6.52011C11.3613 6.09253 11.231 5.65491 11.1301 5.21011C11.0801 4.99011 11.0401 4.76011 11.0101 4.53011C10.8887 3.82573 10.5197 3.18785 9.96972 2.73135C9.41972 2.27485 8.7248 2.02972 8.0101 2.04011H5.0101C4.57913 2.03607 4.15235 2.12493 3.75881 2.30064C3.36527 2.47636 3.01421 2.73481 2.72953 3.05839C2.44485 3.38198 2.23324 3.76311 2.10909 4.17583C1.98494 4.58855 1.95118 5.02317 2.0101 5.45011C2.54284 9.63949 4.45613 13.532 7.44775 16.5127C10.4394 19.4935 14.3388 21.3926 18.5301 21.9101H18.9101C19.6475 21.9112 20.3595 21.6406 20.9101 21.1501C21.2265 20.8672 21.4792 20.5203 21.6516 20.1324C21.8239 19.7446 21.9121 19.3245 21.9101 18.9001V15.9001C21.8979 15.2055 21.6449 14.5367 21.1944 14.0078C20.744 13.4789 20.1239 13.1227 19.4401 13.0001ZM19.9401 19.0001C19.9399 19.1421 19.9095 19.2824 19.8509 19.4117C19.7923 19.5411 19.7068 19.6564 19.6001 19.7501C19.4887 19.8471 19.3581 19.9195 19.2168 19.9626C19.0755 20.0057 18.9267 20.0185 18.7801 20.0001C15.035 19.5199 11.5563 17.8066 8.89282 15.1304C6.2293 12.4542 4.53251 8.96745 4.0701 5.22011C4.05419 5.07363 4.06813 4.92544 4.1111 4.7845C4.15407 4.64356 4.22517 4.5128 4.3201 4.40011C4.41381 4.29344 4.52916 4.20795 4.65848 4.14933C4.7878 4.09071 4.92812 4.06029 5.0701 4.06011H8.0701C8.30265 4.05494 8.52972 4.13099 8.71224 4.27518C8.89476 4.41937 9.02131 4.62268 9.0701 4.85011C9.1101 5.12345 9.1601 5.39345 9.2201 5.66011C9.33562 6.18726 9.48936 6.70529 9.6801 7.21011L8.2801 7.86011C8.1604 7.91503 8.05272 7.99306 7.96326 8.08971C7.87379 8.18636 7.8043 8.29973 7.75877 8.42331C7.71324 8.54689 7.69257 8.67824 7.69795 8.80983C7.70332 8.94142 7.73464 9.07066 7.7901 9.19011C9.2293 12.2729 11.7073 14.7509 14.7901 16.1901C15.0336 16.2901 15.3066 16.2901 15.5501 16.1901C15.6748 16.1455 15.7894 16.0766 15.8873 15.9873C15.9851 15.898 16.0643 15.7902 16.1201 15.6701L16.7401 14.2701C17.2571 14.455 17.7847 14.6086 18.3201 14.7301C18.5868 14.7901 18.8568 14.8401 19.1301 14.8801C19.3575 14.9289 19.5608 15.0554 19.705 15.238C19.8492 15.4205 19.9253 15.6476 19.9201 15.8801L19.9401 19.0001Z"
                    fill="#06DCFF"
                  />
                </Svg>

                <Text style={{ marginLeft: '3px' }}>{phoneNumber}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={{ margin: '16px 24px' }}>
          <Text style={styles.headline}>
            {t('Profile')}
          </Text>

          {personalStatement ? (
            <Text style={{ fontSize: 12, marginTop: 4, lineHeight: 1.25, color: '#3F4647'  }}>
              {personalStatement}
            </Text>
          ) : null}

          {educations.length > 0 ||
          timeline.length > 0 ||
          skills.length > 0 ||
          languages.length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 24,
              }}
            >
              {educations.length > 0 || timeline.length > 0 ? (
                <View style={{ flex: '0 0 55%' }}>
                  {educations.length > 0 ? (
                    <View>
                      <Text style={styles.headline}>{t('Education')}</Text>

                      {sortEducation(educations).map((i, idx) => (
                        <View
                          key={idx}
                          style={[styles.section, { marginTop: idx === 0 ? 4 : 16 }]}
                        >
                          <Text>
                            {i.degree || t('Degree {{index}}', { index: '?' })}
                            {i.institution && ` - ${i.institution}`}
                          </Text>
                          <Text style={{ fontSize: 10, marginTop: 4 }}>
                            {i.educateFrom
                              ? format(new Date(i.educateFrom), 'dd/MM/yyyy')
                              : '?'}{' '}
                            -{' '}
                            {i.educateTo
                              ? format(new Date(i.educateTo), 'dd/MM/yyyy')
                              : '?'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {timeline.length > 0 ? (
                    <View style={{ marginTop: 24 }}>
                      <Text style={styles.headline}>
                        {t('EmploymentTimeline')}
                      </Text>

                      {sortTimeline(timeline).map((i, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.section,
                            { marginTop: idx === 0 ? 4 : 16 },
                          ]}
                        >
                          <Text>
                            {i.position || t('PositionNumber', { index: '?' })}
                            {i.company && ` - ${i.company}`}
                          </Text>
                          <Text style={{ marginTop: 2 }}>{i.location}</Text>

                          <Text style={{ fontSize: 10, marginTop: 4 }}>
                            {i.startDate
                              ? format(new Date(i.startDate), 'dd/MM/yyyy')
                              : '?'}{' '}
                            -{' '}
                            {i.endDate
                              ? format(new Date(i.endDate), 'dd/MM/yyyy')
                              : i.isCurrent
                              ? t('Present')
                              : '?'}
                          </Text>

                          {i.description ? (
                            <View style={{ marginTop: 4, color: '#3F4647' }}>
                              {ReactHtmlParser(i.description, {
                                transform(node) {
                                  if (node.type === 'text') {
                                    return (
                                      <Text
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 100,
                                          lineHeight: 1.25,
                                        }}
                                      >
                                        {node.data}
                                      </Text>
                                    );
                                  }
                                },
                              })}
                            </View>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              ) : null}

              {skills.length > 0 || languages.length > 0 ? (
                <View style={{ flex: '0 0 39%' }}>
                  {skills.length > 0 ? (
                    <View>
                      <Text style={styles.headline}>{t('Skills')}</Text>
                      {skills.map((i, idx) => (
                        <View key={i.name} style={{ marginTop: idx === 0 ? 4 : 16 }}>
                          <Text style={styles.section}>
                            {i.name
                              ? i.name
                              : t('Skill {{index}}', { index: idx + 1 })}
                          </Text>

                          {showLevel && (
                            <View
                              style={{
                                backgroundColor: '#DBE1E5',
                                borderRadius: 4,
                                flexDirection: 'row',
                                height: 4,
                                marginTop: 4,
                              }}
                            >
                              {Array.from(new Array(maxSkillLevel)).map(
                                (_, idx) => (
                                  <View
                                    key={idx}
                                    style={{
                                      backgroundColor:
                                        idx + 1 > i.level
                                          ? 'transparent'
                                          : '#06DCFF',
                                      borderTopLeftRadius: idx === 0 ? 4 : 0,
                                      borderBottomLeftRadius: idx === 0 ? 4 : 0,
                                      borderTopRightRadius:
                                        idx === maxSkillLevel - 1 ? 4 : 0,
                                      borderBottomRightRadius:
                                        idx === maxSkillLevel - 1 ? 4 : 0,
                                      flexGrow: 1,
                                    }}
                                  />
                                )
                              )}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {languages.length > 0 ? (
                    <View style={{ marginTop: 24 }}>
                      <Text style={styles.headline}>{t('Languages')}</Text>

                      {languages.map((i, idx) => (
                        <View
                          key={i.name}
                          style={[
                            styles.section,
                            { marginTop: idx === 0 ? 8 : 8 },
                          ]}
                        >
                          <Text>
                            {i.name
                              ? i.name
                              : t('Language {{index}}', {
                                  index: idx + 1,
                                })}
                            {showLevel &&
                              ` - ${languagesLevels[i.level - 1].label}`}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
};

Font.register({
  family: 'Roboto',
  src: Roboto,
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    fontFamily: 'Roboto',
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    fontSize: 14,
  },
});

export default MyDocument;
