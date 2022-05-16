import Roboto from '@fontsource/roboto/files/roboto-vietnamese-500-normal.woff';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import moment from 'moment';
import React, { useMemo } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useTranslation } from 'react-i18next';
import useLanguageLevels from '../../hooks/useLanguageLevels';
import { sortTimeline, sortEducation } from '../../utils/profileUtils';
import progress1 from './assets/Template2/progress1.png';
import progress2 from './assets/Template2/progress2.png';
import progress3 from './assets/Template2/progress3.png';
import progress4 from './assets/Template2/progress4.png';
import progress5 from './assets/Template2/progress5.png';

const progressImages = [progress1, progress2, progress3, progress4, progress5];

const SecondTemplate = ({ profile }) => {
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
    showLevel,
    skills = [],
    timeline = [],
  } = profile;

  const sectionIndex = useMemo(() => {
    const initialIndex = [1, 2, 3, 4, 5];
    let max = 0;
    if (personalStatement) {
      initialIndex[0] = ++max;
    }

    if (timeline.length > 0) {
      initialIndex[1] = ++max;
    }

    if (educations.length > 0) {
      initialIndex[2] = ++max;
    }

    if (skills.length > 0) {
      initialIndex[3] = ++max;
    }

    if (languages.length > 0) {
      initialIndex[4] = ++max;
    }

    return initialIndex;
  }, [
    educations?.length,
    languages?.length,
    personalStatement,
    skills?.length,
    timeline?.length,
  ]);

  const generateTimelineHeader = (timelineItem) => {
    if (timelineItem) {
      // Put ? for timeline because the timeline is sorted
      let res = timelineItem.position || t('PositionNumber', { index: '?' });

      if (timelineItem.company) {
        res = `${res} ${t('AtCompany', { company: timelineItem.company })}`;
      }

      return res;
    }

    return null;
  };

  const generateSkillItem = () => {
    return skills.map((i, idx) => {
      return (
        <View key={i.name} style={styles.sectionSkillItem}>
          <Text style={[styles.skillFlexItem, styles.bold12]}>
            {i.name ? i.name : t('Skill {{index}}', { index: idx + 1 })}
          </Text>

          {showLevel && (
            <Image
              src={progressImages[i.level - 1]}
              style={[styles.skillFlexItem, { height: 10, width: 'auto' }]}
            />
          )}
        </View>
      );
    });
  };

  const generateLanguageItem = () => {
    return languages.map((i, idx) => {
      return (
        <View key={i.name} style={styles.sectionSkillItem}>
          <Text style={[styles.skillFlexItemSmall, styles.bold12]}>
            {i.name
              ? i.name
              : t('Language {{index}}', {
                  index: idx + 1,
                })}
          </Text>

          {showLevel && (
            <Text style={[styles.skillFlexItemBig, styles.bold12]}>
              {' - '} {languagesLevels[i.level - 1].label}
            </Text>
          )}
        </View>
      );
    });
  };

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.section1}>
          <Text style={styles.fullName}>{fullName}</Text>
          <Text style={styles.position}>{position}</Text>
        </View>
        <View style={styles.section2}>
          {location ? (
            <Text
              style={[styles.section2Item, styles.bold12, { width: '100%' }]}
            >
              {t('Address')}: <Text style={styles.normal16}>{location}</Text>
            </Text>
          ) : null}
          {phoneNumber ? (
            <Text style={[styles.section2Item, styles.bold12]}>
              {t('Phone')}: <Text style={styles.normal16}>{phoneNumber}</Text>
            </Text>
          ) : null}
          {email ? (
            <Text style={[styles.section2Item, styles.bold12]}>
              {t('Email')}: <Text style={styles.normal16}>{email}</Text>
            </Text>
          ) : null}
        </View>
        {personalStatement ? (
          <View style={styles.sectionProfile}>
            <Text style={[styles.sectionProfileItemLeft, styles.heading1]}>
              {sectionIndex[0]}. {t('Profile')}
            </Text>
            <Text style={[styles.normal16, styles.sectionProfileItemRight]}>
              {personalStatement}
            </Text>
          </View>
        ) : null}

        {timeline.length > 0 ? (
          <>
            <Text style={[styles.heading1, { marginBottom: 24 }]}>
              {sectionIndex[1]}. {t('Employee Timeline')}
            </Text>

            {sortTimeline(timeline).map((timelineItem, timelineIndex) => (
              <View
                style={[
                  styles.sectionTimeline,
                  { marginTop: timelineIndex === 0 ? 4 : 8 },
                ]}
              >
                <View style={styles.timeline1stRow}>
                  <Text style={[styles.normal10]}>
                    {timelineItem.startDate
                      ? moment(timelineItem.startDate).format('DD/MM/YYYY')
                      : '?'}
                    {' - '}
                    {timelineItem.endDate
                      ? moment(timelineItem.endDate).format('DD/MM/YYYY')
                      : timelineItem.isCurrent
                      ? t('Present')
                      : '?'}
                  </Text>
                  <Text style={[styles.normal10, { marginLeft: 18 }]}>
                    {timelineItem.location}
                  </Text>
                </View>
                <Text style={{ marginTop: 2, fontSize: 12, fontWeight: 500 }}>
                  {generateTimelineHeader(timelineItem, timelineIndex)}
                </Text>

                {timelineItem.description ? (
                  <View style={{ marginTop: 8 }}>
                    {ReactHtmlParser(timelineItem.description, {
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
          </>
        ) : null}

        {educations.length > 0 ? (
          <>
            <Text
              style={[styles.heading1, { marginBottom: 24, marginTop: 16 }]}
            >
              {sectionIndex[2]}. {t('Education')}
            </Text>

            {sortEducation(educations).map((education) => (
              <View style={styles.sectionEducation}>
                <Text
                  style={[styles.sectionEducationItemLeft, styles.normal10]}
                >
                  {education.educateFrom
                    ? moment(education.educateFrom).format('DD/MM/YYYY')
                    : '?'}
                  {' - '}
                  {education.educateTo
                    ? moment(education.educateTo).format('DD/MM/YYYY')
                    : '?'}
                </Text>
                <View style={styles.sectionEducationItemRight}>
                  <Text style={styles.bold12}>{education.institution}</Text>

                  <Text style={styles.normal10}>
                    {education.degree || t('Degree {{index}}', { index: '?' })}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {skills.length > 0 ? (
          <>
            <Text
              style={[styles.heading1, { marginBottom: 24, marginTop: 16 }]}
            >
              {sectionIndex[3]}. {t('Skill')}
            </Text>
            <View style={styles.sectionSkill}>{generateSkillItem()}</View>
          </>
        ) : null}
        {languages.length > 0 ? (
          <>
            <Text
              style={[styles.heading1, { marginBottom: 24, marginTop: 16 }]}
            >
              {sectionIndex[4]}. {t('Language')}
            </Text>
            <View style={styles.sectionSkill}>{generateLanguageItem()}</View>
          </>
        ) : null}
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
  section1: {
    marginBottom: 40,
    textAlign: 'left',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  fullName: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 700,
    marginBottom: 4,
  },
  position: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 400,
    letterSpacing: 0.15,
    textAlign: 'left',
  },
  section2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  section2Item: {
    width: '45%',
    marginBottom: 8,
  },
  bold12: {
    fontSize: 12,
    fontWeight: 500,
  },
  normal16: {
    fontSize: 12,
    fontWeight: 100,
    lineHeight: 1.25,
  },
  normal10: {
    fontSize: 10,
    fontWeight: 400,
  },
  heading1: {
    fontSize: 18,
    fontWeight: 700,
  },
  sectionProfile: {
    flexDirection: 'row',
    marginBottom: 40,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  sectionProfileItemLeft: {
    width: '30%',
  },
  sectionProfileItemRight: {
    width: '70%',
  },
  sectionTimeline: {
    flexDirection: 'column',
    marginBottom: 24,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  timeline1stRow: {
    flexDirection: 'row',
    justifyContent: 'space-betwee',
    alignContent: 'flex-start',
  },
  sectionTimelineItem: {
    width: '30%',
  },
  sectionTimelineItemMiddle: {
    width: '35%',
  },
  sectionEducation: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  sectionEducationItemLeft: {
    width: '35%',
  },
  sectionEducationItemRight: {
    width: '65%',
  },
  sectionSkill: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  sectionSkillItem: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    marginBottom: 24,
  },
  skillFlexItem: {
    width: '48%',
  },
  skillFlexItemSmall: {
    width: '40%',
  },
  skillFlexItemBig: {
    width: '56%',
  },
});

export default SecondTemplate;
