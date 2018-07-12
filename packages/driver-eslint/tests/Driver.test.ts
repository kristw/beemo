import fs from 'fs';
import ESLintDriver from '../src/ESLintDriver';

jest.mock('fs');

describe('ESLintDriver', () => {
  let driver;

  beforeEach(() => {
    driver = new ESLintDriver();
    driver.context = {
      configPaths: [],
    };
    driver.tool = {
      on: jest.fn(),
    };
    driver.bootstrap();
  });

  it('sets options from constructor', () => {
    driver = new ESLintDriver({
      args: ['--foo', '--bar=1'],
      dependencies: ['babel'],
      env: { DEV: 'true' },
    });

    expect(driver.options).toEqual({
      args: ['--foo', '--bar=1'],
      copy: false,
      dependencies: ['babel'],
      env: { DEV: 'true' },
    });
  });

  it('sets correct metadata', () => {
    expect(driver.metadata).toEqual(
      expect.objectContaining({
        bin: 'eslint',
        configName: '.eslintrc.js',
        configOption: '--config',
        dependencies: [],
        description: 'Lint files with ESLint',
        filterOptions: true,
        helpOption: '--help',
        title: 'ESLint',
        useConfigOption: false,
      }),
    );
  });

  describe('mergeConfig()', () => {
    it('merges using eslint engine', () => {
      expect(
        driver.mergeConfig(
          {
            env: {
              node: true,
            },
            rules: {
              foo: 'error',
            },
          },
          {
            rules: {
              foo: ['error', 'always'],
            },
          },
        ),
      ).toEqual({
        env: {
          node: true,
        },
        rules: {
          foo: ['error', 'always'],
        },
      });
    });
  });

  describe('handleCreateIgnoreFile()', () => {
    it('does nothing if no ignore field', () => {
      const config = { foo: 123 };

      driver.handleCreateIgnoreFile('/some/path/.eslintrc.js', config);

      expect(config).toEqual({ foo: 123 });
    });

    it('errors if not an array', () => {
      expect(() => {
        driver.handleCreateIgnoreFile('/some/path/.eslintrc.js', {
          ignore: 'foo',
        });
      }).toThrowErrorMatchingSnapshot();
    });

    it('creates ignore file and updates references', () => {
      const config = {
        foo: 123,
        ignore: ['foo', 'bar', 'baz'],
      };

      driver.handleCreateIgnoreFile('/some/path/.eslintrc.js', config);

      expect(fs.writeFileSync).toHaveBeenCalledWith('/some/path/.eslintignore', 'foo\nbar\nbaz');

      expect(driver.context.configPaths).toEqual(['/some/path/.eslintignore']);

      expect(config).toEqual({ foo: 123 });
    });
  });
});