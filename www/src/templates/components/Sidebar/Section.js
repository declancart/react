/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
*/

'use strict';

import isItemActive from 'utils/isItemActive';
import Link from 'gatsby-link';
import React from 'react';
import slugify from 'utils/slugify';
import {colors, media} from 'theme';
import MetaTitle from '../MetaTitle';

// TODO Update isActive link as document scrolls past anchor tags
// Maybe used 'hashchange' along with 'scroll' to set/update active links

const Section = ({isActive, location, onClick, section}) => (
  <div>
    <MetaTitle
      onClick={onClick}
      cssProps={{
        color: isActive ? colors.text : colors.subtle,
        marginTop: 10,
        ':hover': {
          color: colors.text,
        },
      }}>
      {section.title}
    </MetaTitle>
    {isActive &&
      <ul
        css={{
          marginBottom: 10,
        }}>
        {section.items.map(item => (
          <li
            key={item.id}
            css={{
              marginTop: 5,
            }}>
            {CreateLink(location, section, item)}

            {item.subitems &&
              <ul css={{marginLeft: 20}}>
                {item.subitems.map(subitem => (
                  <li key={subitem.id}>
                    {CreateLink(location, section, subitem)}
                  </li>
                ))}
              </ul>}
          </li>
        ))}
      </ul>}
  </div>
);

const activeLinkCss = {
  fontWeight: 'bold',
};

const activeLinkBefore = {
  width: 4,
  height: 25,
  borderLeft: `4px solid ${colors.brand}`,
  paddingLeft: 16,
  position: 'absolute',
  left: 0,
  marginTop: -3,

  [media.greaterThan('largerSidebar')]: {
    left: 15,
  },
};

const linkCss = {
  color: colors.text,
  display: 'inline-block',
  borderBottom: '1px solid transparent',
  transition: 'border 0.2s ease',
  marginTop: 5,

  '&:hover': {
    color: colors.subtle,
  },
};

const CreateLink = (location, section, item) => {
  const isActive = isItemActive(location, item);
  if (item.id.includes('.html')) {
    return (
      <Link css={[linkCss, isActive && activeLinkCss]} to={item.id}>
        {isActive && <span css={activeLinkBefore} />}
        {item.title}
      </Link>
    );
  } else if (item.forceInternal) {
    return (
      <Link css={[linkCss, isActive && activeLinkCss]} to={item.href}>
        {isActive && <span css={activeLinkBefore} />}
        {item.title}
      </Link>
    );
  } else if (item.href) {
    return (
      <a
        css={[
          linkCss,
          {
            paddingRight: 15,

            ':hover': {
              borderBottomColor: 'transparent',
            },

            ':after': {
              content: '" " url(/external.png)', // TODO Move to a better relative location
            },
          },
        ]}
        href={item.href}>
        {item.title}
      </a>
    );
  } else {
    return (
      <Link
        css={[linkCss, isActive && activeLinkCss]}
        to={slugify(item.id, section.directory)}>
        {isActive && <span css={activeLinkBefore} />}
        {item.title}
      </Link>
    );
  }
};

export default Section;