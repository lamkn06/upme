import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import format from 'date-fns/format';
import React from 'react';
import Roboto from '@fontsource/roboto/files/roboto-vietnamese-500-normal.woff';
import ReactHtmlParser from 'react-html-parser';
import { sortTimeline, sortEducation } from '../../utils/profileUtils';
import { useTranslation } from 'react-i18next';
import useLanguageLevels from '../../hooks/useLanguageLevels';
const maxSkillLevel = 5;

const ThirdTemplate = ({ profile }) => {
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
        <View style={styles.pageContainer}>
          <View style={styles.leftContainer}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                fontFamily: 'Roboto',
              }}
            >
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  style={{
                    borderRadius: '100%',
                    height: '76px',
                    width: '76px',
                    marginRight: '16px',
                  }}
                />
              ) : null}

              <View>
                <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {fullName}
                </Text>

                <Text style={{ fontSize: '16px', paddingTop: '8px' }}>
                  {position}
                </Text>
              </View>
            </View>
            <View style={styles.profileSection}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {t('Profile')}
              </Text>
              {personalStatement ? (
                <Text style={{
                  fontSize: 12,
                  marginTop: 12,
                  fontWeight: 100,
                  lineHeight: 1.25,
                  color: '#3F4647'
                }}>
                  {personalStatement}
                </Text>
              ) : null}
            </View>
            {educations.length > 0 ? (
              <View style={styles.educationSection}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {t('Education')}
                </Text>

                {sortEducation(educations).map((i, idx) => (
                  <View key={idx} style={{ marginTop: idx === 0 ? 12 : 16 }}>
                    <Text style={styles.ItemText}>
                      {i.degree || t('Degree {{index}}', { index: '?' })}
                      {i.institution && ` - ${i.institution}`}
                    </Text>

                    <Text style={styles.ItemDate}>
                      {i.educateFrom ? format(new Date(i.educateFrom), 'dd/MM/yyyy') : '?'} -{' '}
                      {i.educateTo ? format(new Date(i.educateTo), 'dd/MM/yyyy') : '?'}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {timeline.length > 0 ? (
              <View style={{ marginTop: 24 }}>
                <Text style={styles.headline}>{t('EmploymentTimeline')}</Text>

                {sortTimeline(timeline).map((i, idx) => (
                  <View key={idx} style={{ marginTop: idx === 0 ? 12 : 16 }}>
                    <Text style={styles.ItemText}>
                      {i.position || t('PositionNumber', { index: '?' })}
                      {i.company && ` - ${i.company}`}
                    </Text>
                    <Text style={[styles.ItemText, { marginTop: 2 }]}>{i.location}</Text>

                    <Text style={styles.ItemDate}>
                      {i.startDate ? format(new Date(i.startDate), 'dd/MM/yyyy') : '?'} -{' '}
                      {i.endDate ? format(new Date(i.endDate), 'dd/MM/yyyy')
                        : i.isCurrent ? t('Present') : '?'}
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
                                    fontWeight: 400,
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
            {/* End of LeftContainer */}
          </View>

          <View style={styles.rightContainer}>
            <View style={styles.contactDetailsSection}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
                {t('Contact Details')}
              </Text>
              {location ? (
                <Text style={{ fontSize: 12, marginTop: 8 }}>{location}</Text>
              ) : null}
              {phoneNumber ? (
                <Text style={{ fontSize: 12, marginTop: 8 }}>
                  {phoneNumber}
                </Text>
              ) : null}
              {email ? (
                <Text style={{ fontSize: 12, marginTop: 8 }}>{email}</Text>
              ) : null}
            </View>
            {skills.length > 0 ? (
              <View style={{ marginTop: 24 }}>
                <Text style={styles.headline}>{t('Skills')}</Text>
                {skills.map((i, idx) => (
                  <View key={idx} style={{ marginTop: idx === 0 ? 12 : 16 }}>
                    <Text style={styles.ItemText}>
                      {i.name
                        ? i.name
                        : t('Skill {{index}}', { index: idx + 1 })}
                    </Text>

                    {showLevel && (
                      <View
                        style={{
                          backgroundColor: '#C1C9CD',
                          borderRadius: 4,
                          flexDirection: 'row',
                          height: 4,
                          marginTop: 4,
                        }}
                      >
                        {Array.from(new Array(maxSkillLevel)).map((_, idx) => (
                          <View
                            key={idx}
                            style={{
                              backgroundColor:
                                idx + 1 > i.level ? 'transparent' : '#FFF',
                              borderTopLeftRadius: idx === 0 ? 4 : 0,
                              borderBottomLeftRadius: idx === 0 ? 4 : 0,
                              borderTopRightRadius:
                                idx === maxSkillLevel - 1 ? 4 : 0,
                              borderBottomRightRadius:
                                idx === maxSkillLevel - 1 ? 4 : 0,
                              flexGrow: 1,
                            }}
                          />
                        ))}
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
                  <View key={i.name} style={{ marginTop: idx === 0 ? 12 : 8 }}>
                    <Text style={styles.ItemText}>
                      {i.name
                        ? i.name
                        : t('Language {{index}}', {
                          index: idx + 1,
                        })}
                      {showLevel && ` - ${languagesLevels[i.level - 1].label}`}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {/* End of RightContainer */}
          </View>
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
    fontFamily: 'Roboto',
    // backgroundColor: 'linear-gradient(90deg, pink 75%, cyan 25%)'
  },
  backgroundImg: {
    padding: 0,
    width: 245,
    position: 'fixed',
    bottom: 0,
    top: -20,
    right: -20,
    zIndex: -1,
  },
  pageContainer: {
    flexDirection: 'row',
  },
  leftContainer: {
    paddingHorizontal: 15,
    width: '65%',
    minHeight: '100vh',
    color: 'black',
    flexDirection: 'column',
    padding: 20,
  },
  profileSection: {
    marginTop: 24,
  },
  educationSection: {
    marginTop: 24,
  },
  ItemText: {
    fontSize: 14,
    fontWeight: 100,
    lineHeight: 1.25,
  },
  ItemDate: {
    fontSize: 10,
    marginTop: 4,
    color: '#3F4647'
  },
  rightContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#3372EE',
    width: '35%',
    minHeight: '100vh',
    color: 'white',
    flexDirection: 'column',
  },
  contactDetailsSection: {
    marginTop: 120,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ThirdTemplate;
